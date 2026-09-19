---
title: "Win7 如何一路锁死技术选型（以及一个 131072 字节的空库事故）"
date: "2026-10-31"
description: "一句“顺便支持一下 Win7”，决定了后端工具链锁定 Go 1.20、无 CGO、纯 Go SQLite，前端按 Chrome 109 构建。以及一个把数据写进错位目录的空库事故，和交付脚本的自检化。"
tags:
  - Win7
  - Go
  - 交付
  - 兼容性
category: "Engineering/Equipment"
relations:
  parent: "01-overview"
  related:
    - "08-ui-without-framework"
    - "09-ai-self-review"
cover: "https://img.istarry.top/images/bg1.jpg"
---

# Win7 如何一路锁死技术选型

---

## 0. 一句话的代价：约束传导链

先说结论的形状。这个项目的所有技术选型都可以从一条约束推出来：

```
Win7 SP1 (x64)
  └─ 后端工具链 Go ≤ 1.20（最后支持 Win7 的版本；EOL，无安全更新）
       └─ CGO_ENABLED=0（静态单文件，不带运行时 DLL）
            └─ SQLite 用纯 Go 驱动（glebarez/sqlite → modernc.org/sqlite）
  └─ 浏览器上限 Chrome 109 / Firefox ESR 115
       └─ 前端构建目标 target: 'chrome109'
       └─ 排除 Next.js（官方基线 Chrome 111+，硬冲突；详见本系列第 8 篇）
```

这张图不是事后总结，它是**倒着被现实逼出来的**：目标机器是 Win7 → 浏览器上限被钉死在 Chrome 109 → 任何"官方基线高于 109"的前端框架出局；要让客户"双击 exe 就能用" → 不能带任何需要安装的运行时 → CGO 必须关 → SQLite 不能用带 C 代码的驱动；Go 1.21 把 Win7 从支持列表里去掉 → 工具链停在 1.20。

治理文件里这条链记在两处（`AGENTS.md:45` 的技术栈约束、`AGENTS.md:59` 的决策 11），决策 11 从第二句起就是代价清单：

> 11. **Win7 兼容目标（2026-09-07 新增，用户确认）**：交付支持范围 = Win7 SP1 + Win10/11。已接受代价：Go ≤ 1.20（EOL、无安全更新）+ 全部依赖版本锁定 + 双环境兼容基线 + 前端按 Chrome 109 / Firefox ESR 115 能力降级。细节已定：目标 Win7 全为 **64 位**（构建矩阵 `GOARCH=amd64`）；交付物**随附 Chrome 109 离线安装包与安装说明**；主章程原文不改动，本决策以 AGENTS.md 为权威记录。Win7 不支持 IE11 渲染本系统。

**注意这个刻意的写法**：决策 11 从第一句起就把"代价"写进去了，这是本项目的决策条目格式——结论 + 理由 + **代价**。只在利弊表里写"好处：兼容老机器"的决策记录，半年后没人记得自己付出了什么。

---

## 1. 为什么 Go 版本被锁死：不是保守，是运行时支持列表

Go 1.21 的发布说明把 Windows 7、Windows 8、Windows Server 2008 和 Windows Server 2012 **从支持平台中移除**（[Go 官方 MinimumRequirements](https://go.dev/wiki/MinimumRequirements)）。因此对"必须跑在 Win7 SP1 上"的项目来说，**Go 1.20 是最后一个可用版本**，没有第二个选项。

这个结论在仓库里以两种形式固化：

第一，模块声明（`go.mod:3`）：

```
go 1.20
```

第二，构建脚本显式指定工具链（`scripts/build-release.ps1:88-92`）：

```powershell
Write-Host '== 2/5 用 Go 1.20 工具链编译（Win7 兼容）=='
$env:GOTOOLCHAIN = 'go1.20.14'   # 自动下载该工具链（goproxy 可访问时）
$env:CGO_ENABLED = '0'
$env:GOOS = 'windows'
$env:GOARCH = 'amd64'
```

`GOTOOLCHAIN` 让"用哪个 Go 编译"成为**脚本里的常量**，而不是"构建机上恰好装了什么"。只靠开发机的 go 版本来保证兼容性，这个保证随时会失效——换台机器、或有人顺手升了一下 Go，交付物就悄悄不再是 Win7 版本。工具链由 GOTOOLCHAIN 常量 + `go.mod` 的 `go 1.20` 两处共同钉住。

另外，界面测试脚本用的是**同一组**环境变量（`scripts/ui-review.ps1:246-247`），包括仓库内的模块缓存与构建缓存：

```powershell
$env:GOTOOLCHAIN = 'go1.20.14'; $env:CGO_ENABLED = '0'; $env:GOOS = 'windows'; $env:GOARCH = 'amd64'
$env:GOMODCACHE = Join-Path $Root '.gomod\pkg\mod'; $env:GOPATH = Join-Path $Root '.go'; $env:GOCACHE = Join-Path $Root '.gocache'
```

这解决的是一个容易忽略的战场问题：构建机若是**离线或半离线**的（本项目的开发环境就是这样，`.gomod/`、`.gocache/`、`.go/` 都是仓库内目录），"自动下载 Go 1.20.14 工具链"就必须能复用本地缓存，否则脚本断网即挂。

**代价清单（明写）**：Go 1.20 已 EOL，不再有安全更新；整个依赖树（Gin 1.9.1 / GORM 1.25.5 / excelize 2.7.1 …）随之锁死在 2023 年前后的版本上。这不是"暂时不升级"，是**在支持 Win7 期间不能升级**。

**这个代价是清醒接受的**：在"必须跑在 Win7 SP1 上"这个前提下，工具链停在 1.20 不是保守，而是唯一可行——"缺安全更新"是一条能被写进决策记录、持续评估的长期风险，"编出来的 exe 在目标机器上直接起不来"是当场失败，两者不是一个量级的失败。

---

## 2. 为什么必须 `CGO_ENABLED=0`

CGO 一开，Windows 上的 Go 产物就不再是单文件了：它会引入 mingw 工具链编出来的 C 运行时依赖，典型形态是必须随程序一起分发 `libwinpthread-1.dll` 之类的 DLL。对一个"拷进一个文件夹、双击 exe"的交付物来说，这是灾难性的——现场最常见的故障会变成"程序打不开，报缺少某个 DLL"，而客户不知道那是什么，也没法自己解决。

所以关掉 CGO 的直接后果，是 **SQLite 驱动必须换**。带 C 的 `mattn/go-sqlite3` 出局，用的是纯 Go 实现。`go.mod` 里能看到这条链（`go.mod:7`、`go.mod:19`、`go.mod:48-51`）：

```
github.com/glebarez/sqlite v1.7.0
github.com/glebarez/go-sqlite v1.20.3 // indirect
modernc.org/libc v1.24.1 // indirect
modernc.org/mathutil v1.5.0 // indirect
modernc.org/memory v1.6.0 // indirect
modernc.org/sqlite v1.25.0 // indirect
```

`modernc.org/sqlite` 是把 SQLite 的 C 源码**机械翻译**成 Go 的产物，因此不需要 C 编译器；代价是性能与上游 C 版有差距、体积更大。README 的技术栈一节把这条约束写在最显眼处（`README.md:16`）：

> 后端：Go + Gin + GORM + SQLite（**纯 Go 驱动 modernc/glebarez，无 CGO**，go:embed 内嵌前端）

**这里的可复用经验是**：约束要写进构建配置，而不是写进 Wiki。写在文档里的"本项目需兼容 Win7"会腐烂；`go.mod` 的 `go 1.20`、脚本里的 `GOTOOLCHAIN`、`vite.config.ts` 的 `target` 每次构建都被强制执行。三条约束、三个常量、零个人记忆。

---

## 3. 前端的那一半：`chrome109`

后端约束说完，前端其实是被同一根链条带下来的。Win7 上能跑的最高版本浏览器是 Chrome 109（或 Firefox ESR 115），所以前端构建产物不能使用 109 之后才有的语法与 API。这条约束在构建配置里只有一行（`web/vite.config.ts:12-13`）：

```ts
    // Win7 浏览器上限 Chrome 109（决策基线 11）
    target: 'chrome109',
```

这一行是**唯一**的落点；如果它错了或者被人删了，错误不会在开发机上暴露（开发机装的是最新 Chrome，什么语法都能跑），只会在客户的 Win7 上暴露成白屏。所以它的正确性只由"决策 11 + 这一行注释 + 代码评审"三件事共同守护，这也是为什么注释里要写明决策编号——后来的读者能顺着编号找到理由。

这条约束的连带影响，是本项目最大的一次"技术选型拒绝"：用户曾提出"优化界面，加上 Next.js"，而 Next.js 16 的官方浏览器基线是 Chrome 111+，与 Win7 上限 Chrome 109 **硬冲突**，且它需要 Node.js 20.9+（Node 20 装不进 Win7）。最终结论是"观感来自设计令牌，不来自框架"，只引入了 `react-router-dom` 一个依赖（`AGENTS.md:43`、决策 20）。完整的证据链留给本系列第 8 篇。

**所以"Win7 锁死技术选型"的准确说法是**：它锁死的不是某个框架，而是**所有官方支持平台底线高于 Chrome 109 / Go 1.20 的工具**。这个筛选条件会持续生效，直到放弃 Win7。

---

## 4. 事故：一个 131072 字节的空库

技术选型讲完了，下面是这篇里最值得看的部分——一个**与 Win7 无关、但与交付形态强相关**的真实事故。

### 4.1 现场

系统的全部数据路径都是**裸相对名**。这不是疏忽，而是"双击即用 + 单目录交付"的自然结果：程序在哪个目录，`equipment.db` 就写在哪个目录。`config.yaml` 里也确实是这么向运维承诺的（这是 v1.5.1 之前的原文）：

```yaml
# SQLite 数据库文件名（相对程序所在目录）
db_file: equipment.db
```

"相对**程序所在目录**"。

而实现是这样的（`docs/review-v1.5.md:154-160`，只读审查报告的原文）：

```
cmd/equipment/main.go:61        config.Load("config.yaml")
cmd/equipment/main.go:73        database.Open(cfg.DBFile)
internal/service/backup.go:42   func backupDir() string { return "backup" }
internal/api/import.go:24       uploadsDir = "uploads"
```

`config.Load("config.yaml")`、`database.Open("equipment.db")`、`backupDir() = "backup"`、`uploadsDir = "uploads"` —— **全部相对进程的当前工作目录（CWD）解析**。而 CWD 并不等于 exe 所在目录：快捷方式有独立的"起始位置"字段（可以为空、可以填别的目录）；任务计划程序 / 开机自启的默认起始位置很可能是 `C:\Windows\System32`；以管理员身份运行同理。于是"程序所在目录"与"进程工作目录"之间出现了一道缝。

**程序会忠实地在 CWD 建一个新库**，然后一切看起来都正常：它启动、监听端口、打开浏览器、自动备份。唯一的区别是——**台账是空的**。

这一条最危险的地方在于它的连锁面。同一个 CWD 基准还决定了 `backup/` 和 `uploads/` 的位置，于是此时界面上**「手动备份」「恢复备份」「清空重导」全部作用于那个错位文件**。也就是说，用户可能在一个自己都不知道存在的目录里，覆盖或清空一份空数据，而真实数据在另一个目录里安然无恙——反过来也一样：从快捷方式启动后录入的新设备，写进了错位库，下次从资源管理器双击 exe 启动时就"不见了"。

只读审查报告把它判为 **P0-2**，并指出项目其实**已经知道这个失败模式**：诊断构建里专门同时打印工作目录与可执行文件路径，注释写着"帮助判断是否从错误目录启动"——**即已知风险只在诊断版加了对数，未修**。

### 4.2 对照实验：旧 exe vs 新 exe

这类"路径错位"缺陷有个麻烦：它在开发机上**永远复现不了**，因为开发时总是从 exe 目录启动。所以修复必须配一个能自证的对照实验。做法是：造一个**空的可写目录**当"错误工作目录"，让两个 exe 都以它为 CWD 启动，然后数文件、看接口。

实验设置（`docs/review-v1.5.md` 附录 F.3）：`.tmp/phase2-run/{new,old}/` 各含 exe + `config.yaml` + **真实交付库副本**；两者都以 `workdir = .tmp/phase2-wrong/`（空目录、可写）启动，即 **CWD ≠ exe 目录**。

| 观察项 | **旧 exe**（交付版 v1.5.0，未修复） | **新 exe**（含 P0-2 修复） |
|---|---|---|
| 错误目录里新建的文件 | `config.yaml`(63 B) + **`equipment.db`(131,072 B 空库)** + `backup/` + `logs/` | **0 个**（目录保持空） |
| 服务的数据库 | `total=0`（空库！） | **`total=2148`**（exe 同目录的真实库） |
| 监听端口 | **8080**（用了它在错误目录自建的默认配置） | **8097**（exe 目录 `config.yaml` 里的端口） |
| 在该错误目录做自动备份 | **是**（`equipment-2026-09-18_122018.db`） | 否 |
| 日志证据 | — | `数据目录: …\phase2-run\new（exe: …\new\equipment.exe；启动时工作目录: …\phase2-wrong）` |

这张表是全篇最该逐行读的东西，因为它证明的不是"新代码更好"，而是**旧代码的失败是静默的**：

- **131072 字节** = SQLite 建一个空库时的默认文件大小（32 × 4096 字节页）。它不是损坏，是一个完全健康的、只是没有任何数据的库——所以它不会触发任何告警；
- 旧 exe 不仅建了库，还**在错误目录做了启动自动备份**，把一个不存在的业务状态固化成了"备份文件"，等着未来的运维去恢复；
- 旧 exe 监听 **8080**，因为它在错误目录**自己写了一份默认 `config.yaml`**。运维在真实 `config.yaml` 里改了端口这件事，在错误启动路径下会被静默忽略——这解释了为什么"我明明改过端口，怎么还是 8080"这类现场问题很难查；
- 新 exe 在同一条件下的行为是：**错误目录零文件**，服务 `total=2148`，用 exe 目录的配置。日志里那一行三元组（数据目录 / exe / 启动时工作目录）是专门为自己留的证据。

同一份记录里还确认了"正常场景行为不变"：CWD = exe 目录时，`/api/dashboard` `total=2148`、`/api/borrows` `total=333`，`config.yaml` / `equipment.db` / `logs/` / `backup/` 都落在 exe 目录，错误目录仍为空。**修复不是改变正常行为，而是把异常行为变成不可能。**

---

## 5. 修复：`anchorToExeDir`，在 `config.Load` 之前

修复本身很小。`cmd/equipment/anchor.go` 全文只有 41 行，核心函数是这样（`cmd/equipment/anchor.go:29-41`）：

```go
func anchorToExeDir(exePath string, chdir func(string) error) error {
	if exePath == "" {
		return fmt.Errorf("可执行文件路径为空，无法确定数据目录")
	}
	dir := filepath.Dir(exePath)
	if dir == "" || dir == "." {
		return nil
	}
	if err := chdir(dir); err != nil {
		return fmt.Errorf("切换到程序所在目录 %s 失败: %w", dir, err)
	}
	return nil
}
```

调用点在 `run()` 的**第一步**（`cmd/equipment/main.go:60-77`）：

```go
func run() error {
	// 【v1.5 审查 P0-2】在任何文件读写（配置 / 日志 / 数据库 / 备份 / 上传）之前，
	// 先把工作目录锚定到**可执行文件所在目录** ……（注释原文见 cmd/equipment/main.go:60-64）
	step("锚定数据目录到 exe 所在目录")
	wdBefore, _ := os.Getwd()
	exe, err := os.Executable()
	if err != nil {
		return fmt.Errorf("无法确定程序所在目录（当前工作目录 %s）：%w", wdBefore, err)
	}
	if err := anchorToExeDir(exe, os.Chdir); err != nil {
		return err
	}
	wdAfter, _ := os.Getwd()

	step("加载配置")
	cfg, err := config.Load("config.yaml")
```

这段代码里有四个决定，比代码本身重要得多。

### 决定一：位置在最前面，在 `config.Load` 之前

顺序是**唯一**的关键点。若在 `config.Load` 之后才锚定，配置已按错误的 CWD 读进来了（甚至已在错误目录写了一份默认配置），再切目录只会造成更混乱的半状态。所以第一原则是**位置**，不是代码量。

### 决定二：失败即中止，不退回 CWD

`anchorToExeDir` 返回错误时，`run()` 直接把它 return 出去，`main()` 打印"启动失败"并 `os.Exit(1)`（`cmd/equipment/main.go:49-54`）。

**"退回 CWD 继续跑"是这里最诱人的错误选择**：看起来更健壮（多了一种情况能启动），实际上是把已证明会导致数据错位的路径重新放行。拒绝启动的程序是**可见故障**，写进错位目录的程序是**静默故障**——后者才是这次事故的形态。原则是：**宁可不启动，也不要在不确定的数据目录下启动。**

### 决定三：`chdir` 做成注入参数，单测不真切目录

`anchorToExeDir(exePath string, chdir func(string) error) error` 的第二个参数是函数，生产代码传 `os.Chdir`，测试传一个只记录参数的桩（`cmd/equipment/anchor.go:24`）：

```go
// chdir 由调用方注入（生产传 os.Chdir），使单元测试**不必真的切换进程目录**。
```

这是个小而关键的取舍。`cmd/equipment` 这个包此前**没有任何测试**，而它做的第一件新事情就是"改变进程的全局状态"。如果测试真的调用 `os.Chdir`，它会污染同包内其他用例的工作目录（Go 的测试在同一进程里跑），最后你会得到一组互相干扰、随机失败的测试，然后为了让它绿而放弃测试。注入一行函数，把全局副作用限制在生产代码里，测试就干净了。

`anchor_test.go` 覆盖五条路径分支（`cmd/equipment/anchor_test.go:10-44`）：Windows 绝对路径、含空格的绝对路径（`C:\Program Files\Equip\equipment.exe`）、相对路径带目录、仅文件名（无从锚定 → 保持原目录）、空路径（报错）。另加两条：chdir 失败必须能 `errors.Is` 判定（不得静默继续），以及"锚定目录恒等于 `filepath.Dir(exe)`"——这条是把"程序所在目录"这个基准**固定在一处定义**，防止未来有人改歪。记录里的结果是 3 个用例 / 5 个子用例全 PASS（`docs/review-v1.5.md` 附录 F.4）。

### 决定四：逻辑只在 `package main`，不下沉到 `internal/**`

这条约束写在文件头（`cmd/equipment/anchor.go:13-14`）和 `AGENTS.md:119`：

> 注意：本逻辑只放在程序入口（package main），**不得**下沉到 `internal/**` —— 库代码里做全局 Chdir 会破坏既有测试（`internal/service` 的测试自身会 Chdir 到临时目录）。

这是一个很值得抄的判断：**"这段逻辑看起来很通用，应该抽到公共包里"是错的。** 全局 Chdir 的本质是"改进程状态"，把它放进库代码意味着任何引入该库的测试都会连带改变自己的工作目录。所谓"分层"在这里不是审美问题，而是"谁的副作用谁负责"的问题。程序入口可以改全局状态——因为它就是那个进程的 owner；库不该改。

### 附带的两处改动

- `config.yaml` 的注释同步为"基准目录 = `equipment.exe` 所在目录（程序启动时会先把工作目录锚定到该目录……）"，**让文档与实现重新一致**——这条事故的根因之一就是"承诺与实现不一致"，所以修完代码必须回头修承诺；
- `backupDir()` 与 `uploadsDir` 的字符串**一行没动**（`docs/review-v1.5.md` 附录 F.1 的"未改"行）：锚定 CWD 之后，它们自然落在 exe 目录，符合"最小改动"。**不需要为了修一个路径问题去改五处路径拼接。**

---

## 6. 代价与仍未做到的部分

写到这一节必须诚实。上面讲的都是"修好了"，但下面这些是**没有做完的**，其中两条是硬事实红线。

### 6.1 交付形态多了一条新的失败模式：程序目录必须可写

锚定到 exe 目录后，程序必须能在自己所在目录写库、写备份、写日志。如果运维把程序放进 `C:\Program Files\`，普通权限下程序会**启动失败**。

这不是 bug，是这个修复的必然代价：**"数据目录 = 程序所在目录"和"程序可以放在系统受保护目录"这两件事不能同时成立。** 处理方式写进了文档而不是代码（`docs/user-guide.md` §2）：

> 请把程序放在**有写权限的目录**（如 `D:\equipment\`）；放在 `C:\Program Files` 等受保护目录会因无法写数据库而启动失败。

以及 `docs/upgrade-guide.md` §0 的告示栏里也重复了一遍。**注意这是"文档承诺的失败模式"，不是"已实测的失败模式"**：仓库里没有一条"CWD = `C:\Program Files` 且无写权限"的对照实验。所以正文只写"会启动失败"（这是修复语义的直接推论：`config.Load` 会尝试写默认配置文件、`database.Open` 会建库，失败即 return），而不是"实测启动失败"。

### 6.2 直接双击时的 `filepath.Dir` 边界没有实测记录

`anchorToExeDir` 有一条分支：`exePath` 不含目录部分时（`dir == "" || dir == "."`）**保持原工作目录并返回 nil**。单测覆盖了这一分支（"仅文件名（无从锚定）"），但仓库里**没有**"双击 exe 时 `os.Executable()` 实际返回绝对路径还是相对名"的实测记录。代码注释里的设计意图（"仅 'equipment.exe' → 无从锚定，且此时 CWD 解析结果与'exe 所在目录'同义"）我认为合理，但它仍是**推理**，不是实测。

### 6.3 Win7 实机回归尚未执行

这是本系列的一条事实红线，必须原样保留在正文里：

**`release/equipment/install/` 目录当前为空——Chrome 109 离线安装包尚未放入**（我实测确认：该目录项数为 0）。而决策 11 承诺"交付物**随附** Chrome 109 离线安装包与安装说明"。

同时 `AGENTS.md` §6 的"最终验收待办"清单第 ② 条就是：

> ② Win7 SP1 实机回归（需 Chrome109/FF115）

也就是说：**这套系统从来没有在一台真实的 Win7 机器上跑过一次完整流程。** 目前关于 Win7 的全部保证都属于"设计如此"这一档：`GOTOOLCHAIN=go1.20.14` + `CGO_ENABLED=0` 保证**产物不依赖 Win7 上没有的运行时**，`target: 'chrome109'` 保证**前端产物不使用更高版本浏览器才支持的语法**——两者都是构建配置层面的保证；而"在有 Win7 的机器上真的双击、真的打开浏览器、真的导入一次台账"这件事，**尚未发生**。

用户手册的措辞也按这个事实写（`docs/user-guide.md:9-14`：Win7 一行明确要求 Chrome 109 或 Firefox ESR 115、IE 不支持），并给出获取路径——在可联网电脑打开 `https://dl.google.com/chrome/install/109.0.5414.120/chrome_installer.exe` 下载后拷到本机安装，或从内网软件源取同版本离线包放入 `install/` 备用。

**写博客时最不该做的事，就是把"我们锁了工具链"说成"我们已经验证了 Win7 可用"。** 前者是配置事实，后者需要一台机器。

### 6.4 交付文档里的示例输出已经过期

`docs/upgrade-guide.md:103` 的"脚本正常输出示例"写着 `equipment.exe 28498944 字节`，而 `release/equipment/equipment.exe` 的**实测大小是 28,530,688 字节**。示例是从更早的构建里抄下来没更新的。

这属于"文档与现实不符"（本系列第 9 篇会讲：一次全库只读审查列出过 9 处同类问题）。它不影响功能，却恰好出现在一份**给运维照着核对的文件**里。**这类错误的共同特征是：它不影响任何测试，只有人会读它。**

### 6.5 顺带一提：仓库根目录那个 131072 字节的库

根目录现在还留着一个 **131,072 字节**的 `equipment.db`（实测 SHA256 以 `440E3D04…` 开头），与事故里那个空库同样大小；交付库则是 **1,503,232 字节**（`B50615C1…`）。两者都被 `.gitignore` 的 `*.db` 通配忽略（实测 `git check-ignore -v equipment.db` 命中 `.gitignore:22`）。

记录它的价值在于：**131072 字节本身就是个可当场判定的信号**——现场看到这个大小的 `equipment.db`，基本可断定"这是刚建的空库，不是真实数据"。

---

## 7. 交付工程化：让"我测过了"变成可复现的自检

事故修完了，但还有一个更普遍的问题：**同一类错误还会再犯。** 这个项目在 v1.6.0 阶段做的事，是把"交付前的核对"从人的自觉变成脚本的断言。

### 7.1 发布脚本的只读自检：文档版本 == exe 版本

根因很朴素：上一次发布的缺陷正是**人工漏改交付文档里的版本号**（`docs/review-v1.5.md` 附录 H 记录：`docs/user-guide.md` 的升级核对行 `v1.4.0` 漏改成 `v1.5.1`）。于是 `scripts/build-release.ps1` 里多了两件东西。

**第一，版本号的单一来源**（`scripts/build-release.ps1:63-69`）：

```powershell
# 版本号**单一来源**：cmd/equipment/main.go 的 `var version = "x.y.z"`
function Get-DeclaredVersion {
  $main = Join-Path $Root 'cmd\equipment\main.go'
  $m = [regex]::Match((Read-Utf8 $main), 'var version = "([0-9]+\.[0-9]+\.[0-9]+)"')
  if (-not $m.Success) { throw "无法从 cmd\equipment\main.go 解析版本号（期望 var version = ""x.y.z""）" }
  return $m.Groups[1].Value
}
```

版本号**只在 `main.go` 里定义一次**，脚本把它抠出来（当前值 `1.6.0`，`cmd/equipment/main.go:25`），再拿去**要求别的文件**（`scripts/build-release.ps1:176-183`）：

```powershell
# (2) P1-9：交付目录内的**两份文档**必须写明同一版本号
foreach ($doc in @('user-guide.md', 'upgrade-guide.md')) {
  $txt = Read-Utf8 (Join-Path $OutDir $doc)
  if (-not $txt.Contains('v' + $Version)) { $fail += ($doc + ' 内未出现 v' + $Version) }
}
```

判不过就 `exit 1`。**这条断言加上之前先做过一次"先红"实测**：故意不同步文档，脚本输出 `[失败] user-guide.md/upgrade-guide.md 内未出现 v1.6.0` 并以 EXIT=1 结束（`AGENTS.md:143`）。一条从来没红过的断言，你不知道它会不会红。

同一段自检里还有几条，共同特征是**全部只读**：

- **exe 内嵌的是不是本次前端产物**：用 `internal/webui/dist/assets/index-*.js` 的**文件名哈希**当唯一标记，在 exe 字节流里找它；找不到即失败（`scripts/build-release.ps1:155-174`）。顺带覆盖"改完前端忘了重新构建"这个高频错误；
- **交付库设备数 > 0**：借 `internal/service` 的守卫测试真读一次库（`-run TestDeliveredDBHasDevices`），空库即失败（`:185-204`）——防止把一份空库打进"全新安装包"；
- 交付库的大小 / 修改时间 / SHA256 全部打印存档。

`-VerifyOnly` 开关让整套自检可以**在不动代码、不重新构建的前提下单独重跑**（`:22-24`）。

### 7.2 清理交付目录必须显式 `-CleanRuntime`

同一阶段另一处修复（P1-10）方向相反，也很有意思。原实现：无条件递归删除交付目录里的 `backup/`、`uploads/`、`logs/`，并用 `-ErrorAction SilentlyContinue` 吞掉失败，删不掉也照样打印"完成"。

问题是 `release/equipment/` 在本机上**同时是交付目录和数据目录**——一旦它被当作运行目录，删除会连带删掉 `backup\pre-update\*.db`（**升级回退点**）和客户上传的 Excel。改成（`scripts/build-release.ps1:113-131`，缩略）：

```powershell
foreach ($d in @('backup', 'uploads', 'logs')) {
  $stale = @(Get-ChildItem (Join-Path $OutDir $d) -Force -ErrorAction SilentlyContinue)
  if ($stale.Count -eq 0) { continue }
  if (-not $CleanRuntime) {
    Write-Host '   [跳过清理] 未指定 -CleanRuntime，保留上述文件。交付前请确认它们不该随包发出。'
    continue
  }
  foreach ($item in $stale) {
    # 不加 SilentlyContinue：删不掉就抛错，绝不带着残留继续"完成"
    Remove-Item $item.FullName -Recurse -Force
  }
}
```

三条规矩：**默认不删**（`-CleanRuntime` 才删）、**删之前先列清单**、**删不掉就 throw**。"简洁"在这里不是优点——一个删除动作如果默认执行、失败静默、还报告成功，它迟早会删掉不该删的东西，而且没人能事后知道删了什么。

### 7.3 升级快照改到 `backup\pre-update\`

升级脚本 `scripts/update-app.ps1` 的第三个修复（P1-11）是个很典型的"排序陷阱"。原实现把升级前快照写成 `backup\pre-update-<时间戳>.db`，而应用自身的备份列表规则是：**收录 `backup\*.db`、按文件名倒序、从尾部淘汰**（只保留最近 N 份）。于是：

```
'pre-update-…' vs 'equipment-…'
       ↑ 'p' > 'e'
```

`pre-update-*` **恒排在列表前部（优先保留）**，被淘汰的反而是 `equipment-*` 真实业务备份；而且这个文件会出现在界面的「数据备份」页面上，用户可能**误选它做恢复**——用一个升级瞬间的空闲状态覆盖当前数据。

修复只有一行落点的变化，但理由写得很清楚（`scripts/update-app.ps1:46-66`）：

```powershell
# 【v1.6.0 · P1-11】数据库快照写到 backup\pre-update\ **子目录**，不再与业务备份混放：
#   原因：应用自身的备份列表只收录 backup\*.db（不含子目录）并按文件名倒序、从尾部淘汰。
#   快照名为 pre-update-*，而 'p' > 'e'，因此旧写法下它**恒排在最前被优先保留**，
#   被淘汰的反而是 equipment-* 真实备份；它还会出现在「数据备份」页面，可能被误选恢复。
#   放进子目录后：既不参与页面列表，也不参与自动清理（升级快照长期保留，便于回退）。
$backupDir = Join-Path $TargetDir 'backup'
if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Force -Path $backupDir | Out-Null }
$snapshotDir = Join-Path $backupDir 'pre-update'
$stamp = Get-Date -Format 'yyyy-MM-dd_HHmmss'
```

**"不参与列表"这个手法值得记下来**：应用只扫 `backup\*.db`、不递归，所以放进子目录天然同时满足两个目标——不进页面列表、不被自动清理淘汰。比"改文件名让它排后面"或"在淘汰逻辑里加白名单"都更省事，也更难被后来的改动破坏。

### 7.4 升级演练：db 与 config 哈希未变

最后一块拼图是升级演练。**升级的可信度不来自升级脚本的新旧，而来自"升级前后数据没动"这件事能被证明。**

v1.6.0 发布时的演练（`docs/review-v1.5.md` 附录 K.3，用 tag `v1.5.1` 现编的真实旧程序）：

| 核对项 | 结果 |
|---|---|
| `equipment.db` 哈希 | **未变**（`B50615C1…`） |
| `config.yaml` 哈希 | **未变** |
| `equipment.exe` 哈希 | **== 交付包 exe** |
| 快照落点 | `backup\pre-update\pre-update-2026-09-19_085526.db`（子目录内，顶层未出现） |
| 升级前后数值 | 完全相同（`total=2148 IN_STOCK=1815 BORROWED=333`） |

这三行哈希的意义：**"未变"是可证伪的**。如果脚本不小心把 `equipment.db` 也拷过去了（这正是交付包里放一份 `equipment.db` 最危险的地方），哈希会变，演练立刻能看出来。而 `docs/upgrade-guide.md` 把这条铁律写成了 §0 的第一条：

> **只替换 `equipment.exe`**，绝不整体覆盖程序目录 —— 交付包里有一个 `equipment.db`（那是给"全新安装"用的数据文件）。整体拷贝会**覆盖客户自己的数据**。

交付物也按两种用途分开了：`release/equipment/`（完整包，含 `equipment.db`，**仅全新安装用**）与 `release/update-only/`（**仅升级**：exe + `update-app.ps1` + 两份文档，**不含任何数据文件**）。这不是"多打一个包"，而是把"发错包 = 清空客户数据"从流程风险降级为物理不可能。

---

<!--
编辑备注（不发布，供作者与 fact-check 使用）：

1. 事实红线遵守情况：
   - 全文未出现"Win7 已实测通过"；§6.3 明确写了 Win7 实机回归尚未执行、`release/equipment/install/`
     项数为 0（Chrome 109 离线包未放入）。这两条是 source-map §五 的红线 2。
   - 未写"系统已全部验收完成"；§6 整节是"代价与仍未做到的部分"。
   - 未用"我们"指代客户/业务方（红线 6）——全文的"我们"仅指本项目作者 + AI 这一侧。
   - 未编造未记录的数字（红线 5）：对照实验全部数字来自 `docs/review-v1.5.md` 附录 F.3 表；
     exe/db 大小与哈希为本次实测。
   - Go 1.21 移除 Win7/8 支持：这是外部通用事实（不是本仓库记录），正文以"因此 Go 1.20 是最后一个
     可用版本"的推导方式写出，**并已补上外部出处链接**（`https://go.dev/wiki/MinimumRequirements`，
      2026-09-19 经检索核实；仓库内对应原话见 `AGENTS.md:45`）。
   - Chrome 109 是"Win7 上可用的上限"：同样来自决策 11 的原话与 `docs/user-guide.md:14`，
     未额外声称 Chrome 110+ 在 Win7 上"绝对不能运行"。

2. 一处**有意没有写**的东西：`anchorToExeDir` 的 `dir == "" || dir == "."` 分支（仅文件名时保持
   原工作目录）。单测覆盖了它，但仓库里没有"双击 exe 时 os.Executable() 实际返回什么"的实测记录，
   所以正文只在 §6.2 里说明"这是推理而非实测"，没有编造一个双击场景的行为结论。

3. 版本号与哈希：全文只用 tag（`v1.5.1` / `v1.6`；2026-09-19 命名规整后的短形式），每个都用
   `git log -1 --format='%h %s' <tag>` 现场验证过。source-map §六 记录的 12 个失效 commit 哈希
   一个都没引用。

4. 待补素材（source-map §三 篇 7 标注为 ⚠️）：对照实验的双栏截图（空目录起旧/新 exe，
   对比目录文件列表与 total 数值）**尚未制作**。正文用表格呈现同一份数据，表格的每一格都出自
   `docs/review-v1.5.md` 附录 F.3。约束传导链图也比 outline 设想的"手绘/Mermaid 渲染"更朴素——
   用的是代码块里的 ASCII 树，好处是不用维护图片资产。

5. 与 `docs/upgrade-guide.md:103` 的不一致（§6.4）：该文件的"脚本正常输出示例"里
   `equipment.exe 28498944 字节` 是旧构建的值，实测交付 exe 为 28,530,688 B。正文按实测写，
   并把这条不一致本身当作"文档与现实不符"的实例记录。**建议顺手修一下该示例**（不在本次任务范围）。

6. **2026-09-19 改写说明**：本文按用户要求从"AI 视角"改为"开发者视角"，并拆掉模板化结构 ——
   删去 `> TL;DR（给管理者）` 开篇块、`## 8. 给一线开发的 5 条可抄清单`、
   `## 9. 给技术负责人的 3 个决策模板`、`## 附：本文引用锚点（可核对）` 表。
   **所有数字、日期、tag 名、`文件:行` 锚点、代码引用均逐字保留，未新增、删除或"顺手修正"任何事实。**
   章节编号本就在 0–7 连续，删掉原 §8/§9 后无需重排；正文里的 `文件:行` 引用原样留在原处。
   - §9 三份决策模板中只保留了一条判断：「为兼容老平台付出工具链代价」，改写为 §1 末尾一段，
     措辞只用正文已有前提（Win7 SP1 为前提 + Go 1.20 是最后一个可用版本 + EOL 代价），
     **未把模板一里"只监听 127.0.0.1 / 不联网"等正文没有的事实搬进来**；模板二、模板三的判断
     在 §2 与 §4–§5 正文中已有对应段落，未重复保留。
   - 视角层面另改两处：§3「未来的读者（包括 AI）」→「后来的读者」；§6.4「AI 只读审查」→
     「一次全库只读审查」（与第 1 篇导航表口径一致）。删去 TL;DR 后，正文不再出现"（一个人 + 一个 AI）"
     这一自我描述。
   - **随锚点表一并丢失的、正文没有的引用**（fact-check 时如需回溯，去这些文件按原行号看）：
     `AGENTS.md:133`、`AGENTS.md:144-145`、`AGENTS.md:117-120`（正文只有其中的 `:119`）；
     `cmd/equipment/anchor_test.go:47-67`；`scripts/update-app.ps1:68-75`、`:101-102`；
     `README.md:61-70`；`docs/user-guide.md:9-20`、`:36-41`；`docs/upgrade-guide.md:8-26`、`:41-49`；
     `docs/review-v1.5.md:135-166`、`:775-791`；
     以及 tag → commit 哈希行（`v1.5.1` → `5398803`、`v1.6` → `f37d0b2`、全仓 14 个 tag）。
     其余锚点表条目在正文中都有同值引用，删除不丢信息。
   - 篇幅（实测字符数）：正文（不含文末编辑备注）由 21,394 降至 16,978，**减少约 20.6%**；
     含编辑备注的全文件由 22,803 降至 19,517。
-->
