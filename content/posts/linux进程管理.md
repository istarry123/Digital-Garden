---
title: "linux进程管理"
date: "2025-07-21"
description: "本文系统讲解 CentOS 进程管理核心知识，涵盖进程概念、生命周期与状态、静态查看、动态监控、信号控制、优先级调整、后台作业控制以及虚拟文件系统查看 CPU/内存/内核信息."
tags:
  - cloud computing
  - Linux
cover: "https://picsum.photos/seed/digital-garden/1200/630"
---

# 一、进程简介

## 1. 什么是进程
进程是已启动的可执行程序的运行实例，进程有以下组成部分：
- 已分配内存的地址空间；
- 安全属性，包括所有权凭据和特权；
- 程序代码的一个或多个执行线程；
- 进程状态。
程序： 二进制文件，静态 `/usr/bin/passwd` ,`/usr/sbin/useradd`    
进程： 是程序运行的过程， 动态，有生命周期及运行状态。   
![图示](https://img.istarry.top/i/2025/07/20/r7pk9f.png)

## 2. 进程的生命周期
父进程复制自己的地址空间`（fork）`创建一个新的（子）进程结构。   
每个新进程分配一个，唯一的进程 `ID （PID）`，满足跟踪安全性之需。   
任何进程都可以创建子进程。   
所有进程都是第一个系统进程的后代：   
Centos5/6系统进程: `init`   
Centos7系统进程: `systemd`   
Centos9系统进程：`/usr/lib/systemd/systemd`   
![图示](https://img.istarry.top/i/2025/07/20/r9w1a3.png)

## 3. 进程状态
> 进程状态产生原因
在多任务处理操作系统中，每个CPU（或核心）   
在一个时间点上只能处理一个进程。   
在进程运行时，它对CPU 时间和资源分配的要求会不断变化，   
从而为进程分配一个状态，它随着环境要求而改变。   
![图示](https://img.istarry.top/i/2025/07/20/rb6rvp.png)
![图示](https://img.istarry.top/i/2025/07/20/rb6vcy.png) 

# 二. 进程管理process   

## 1. 了解进程的相关信息
- [ x ] PID,PPID
- [ x ] 当前的进程状态
- [ x ] 内存的分配情况
- [ x ] CPU和已花费的实际时间
- [ x ] 用户的UID,他决定进程的特权
- [ x ] 进程名称

## 2. 静态查看进程 ps

### 2.1 静态查看进程ps
ps不是photoshop 而是 precess status (进程状态)   
```
[root@192 ~]# ps aux | head -2
USER        PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root          1  0.0  0.3 193700  6852 ?        Ss   7月20   0:06 /usr/lib/systemd/systemd --switched-root --system --deserialize 21
[root@192 ~]# 
```
`ps a`
: 显示现行终端机下的所有程序 
`ps u`
: 以用户为主的格式来显示程序状况。
`ps x`
: 不以终端机来区分。
> `ps aux` 输出的字段含义
> USER: 运行进程的用户   
> PID： 进程ID   
> %CPU: CPU占用率   
> %MEM: 内存占用率   
> VSZ： 占用虚拟内存   
> RSS: 占用实际内存   
> TTY： 进程运行的终端   
> STAT： 进程状态   
>> R运行 S睡眠(Sleep) T停止进程 Z僵尸进程 X死掉的进度
> START: 进程的启动时间   
> TIME： 进程占用CPU的总时间   
> COMMAND： 进程文件，进程名   

### 2.2 进程排序
语法:`ps aux --sort %cpu`
以CPU占比降序排列（减号是降序）
```
[root@192 ~]# ps aux --sort -%cpu | head -6
USER        PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root          1  0.0  0.3 193700  6852 ?        Ss   7月20   0:06 /usr/lib/systemd/systemd --switched-root --system --deserialize 21
root          2  0.0  0.0      0     0 ?        S    7月20   0:00 [kthreadd]
root          3  0.0  0.0      0     0 ?        S    7月20   0:00 [ksoftirqd/0]
root          4  0.0  0.0      0     0 ?        S    7月20   0:00 [kworker/0:0]
root          5  0.0  0.0      0     0 ?        S<   7月20   0:00 [kworker/0:0H]
[root@192 ~]# ps aux --sort %cpu | head -6
USER        PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root          1  0.0  0.3 193700  6852 ?        Ss   7月20   0:06 /usr/lib/systemd/systemd --switched-root --system --deserialize 21
root          2  0.0  0.0      0     0 ?        S    7月20   0:00 [kthreadd]
root          3  0.0  0.0      0     0 ?        S    7月20   0:00 [ksoftirqd/0]
root          4  0.0  0.0      0     0 ?        S    7月20   0:00 [kworker/0:0]
root          5  0.0  0.0      0     0 ?        S<   7月20   0:00 [kworker/0:0H]
[root@192 ~]#
```
### 2.3 进程的父子关系
语法: `ps -ef`
查看进程的父子关系。请观察PID和CPU
```
[root@192 ~]# ps -ef | head -6
UID         PID   PPID  C STIME TTY          TIME CMD
root          1      0  0 7月20 ?       00:00:06 /usr/lib/systemd/systemd --switched-root --system --deserialize 21
root          2      0  0 7月20 ?       00:00:00 [kthreadd]
root          3      2  0 7月20 ?       00:00:00 [ksoftirqd/0]
root          4      2  0 7月20 ?       00:00:00 [kworker/0:0]
root          5      2  0 7月20 ?       00:00:00 [kworker/0:0H]
[root@192 ~]# 
```

### 2.4 自定义显示字段
语法: `ps axo 自定义字段`
```
[root@192 ~]# ps axo user,pid,ppid,%mem,command |head -3
USER        PID   PPID %MEM COMMAND
root          1      0  0.3 /usr/lib/systemd/systemd --switched-root --system --deserialize 21
root          2      0  0.0 [kthreadd]
[root@192 ~]# 
```

## 3. 动态查看进程 top

### 3.1 上半部分
```
top - 16:39:37 up 1 day, 12:10,  3 users,  load average: 0.00, 0.01, 0.05
Tasks: 180 total,   1 running, 179 sleeping,   0 stopped,   0 zombie
%Cpu(s):  0.0 us,  0.2 sy,  0.0 ni, 99.8 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem :  2031912 total,   208548 free,   963664 used,   859700 buff/cache
KiB Swap:  2097148 total,  2097148 free,        0 used.   830672 avail Mem 
```
说明：
![](https://img.istarry.top/i/2025/07/21/hduwlq.png)
![](https://img.istarry.top/i/2025/07/21/hduyfm.png)
![](https://img.istarry.top/i/2025/07/21/hduyqd.png)
![](https://img.istarry.top/i/2025/07/21/hdv6g5.png)
![](https://img.istarry.top/i/2025/07/21/hdv7hy.png)

### 3.2 下半部分
```
   PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND                                                                                                                                                       
     1 root      20   0  193700   6852   4076 S   0.0  0.3   0:07.14 systemd                                                                                                                                                       
     2 root      20   0       0      0      0 S   0.0  0.0   0:00.08 kthreadd                                                                                                                                                      
     3 root      20   0       0      0      0 S   0.0  0.0   0:00.45 ksoftirqd/0                                                                                                                                                   
     4 root      20   0       0      0      0 S   0.0  0.0   0:00.00 kworker/0:0                                                                                                                                                   
     5 root       0 -20       0      0      0 S   0.0  0.0   0:00.00 kworker/0:0H                                                                                                                                                  
     7 root      rt   0       0      0      0 S   0.0  0.0   0:00.20 migration/0                                                                                                                                                   
     8 root      20   0       0      0      0 S   0.0  0.0   0:00.00 rcu_bh                                                                                                                                                        
     9 root      20   0       0      0      0 S   0.0  0.0   0:05.27 rcu_sched                                                                                                                                                     
    10 root      rt   0       0      0      0 S   0.0  0.0   0:00.62 watchdog/0                                                                                                                                                    
    11 root      rt   0       0      0      0 S   0.0  0.0   0:00.49 watchdog/1                                                                                                                                                    
    12 root      rt   0       0      0      0 S   0.0  0.0   0:00.14 migration/1                                                                                                                                                   
    13 root      20   0       0      0      0 S   0.0  0.0   0:00.57 ksoftirqd/1
```
`top`常用内部指令
```
h|?帮助
M 按内存的使用排序
P 按CPU使用排序
N 以PID的大小排序

< 向前
> 向后
z 彩色，Z设置彩色，使用数字调整
```
`top`技巧
动态查看进程 top，像windows的任务管理器
```
[root@192 ~]# top          //回车，立刻刷新。按z彩色显示，按F，通过光标设置列的顺序。
[root@192 ~]# top -d 1   //每1秒刷新。
[root@192 ~]# top -d 1 -p 10126 查看指定进程的动态信息
[root@192 ~]# top -d 1 -p 10126,1    查看10126和1号进程
```

## 4. 使用信号控制进程 kill

### 4.1 信号种类
给进程发送信号(`kill -l`列出所有支持的信号)
```
[root@192 ~]# kill -l
编号  信号名
 1) SIGHUP       2) SIGINT       3) SIGQUIT      4) SIGILL       5) SIGTRAP
 6) SIGABRT      7) SIGBUS       8) SIGFPE       9) SIGKILL     10) SIGUSR1
11) SIGSEGV     12) SIGUSR2     13) SIGPIPE     14) SIGALRM     15) SIGTERM
16) SIGSTKFLT   17) SIGCHLD     18) SIGCONT     19) SIGSTOP     20) SIGTSTP
21) SIGTTIN     22) SIGTTOU     23) SIGURG      24) SIGXCPU     25) SIGXFSZ
26) SIGVTALRM   27) SIGPROF     28) SIGWINCH    29) SIGIO       30) SIGPWR
31) SIGSYS      34) SIGRTMIN    35) SIGRTMIN+1  36) SIGRTMIN+2  37) SIGRTMIN+3
38) SIGRTMIN+4  39) SIGRTMIN+5  40) SIGRTMIN+6  41) SIGRTMIN+7  42) SIGRTMIN+8
43) SIGRTMIN+9  44) SIGRTMIN+10 45) SIGRTMIN+11 46) SIGRTMIN+12 47) SIGRTMIN+13
48) SIGRTMIN+14 49) SIGRTMIN+15 50) SIGRTMAX-14 51) SIGRTMAX-13 52) SIGRTMAX-12
53) SIGRTMAX-11 54) SIGRTMAX-10 55) SIGRTMAX-9  56) SIGRTMAX-8  57) SIGRTMAX-7
58) SIGRTMAX-6  59) SIGRTMAX-5  60) SIGRTMAX-4  61) SIGRTMAX-3  62) SIGRTMAX-2
63) SIGRTMAX-1  64) SIGRTMAX
[root@192 ~]# 
```

### 4.2 发送信号示例
1 .创建2个文件，查看终端号。
```
[root@192 ~]# touch test1 test2
```
2. 通过一个终端，打开一个vim
```
[root@192 ~]# vim test1
```
3. 通过一个终端，打开一个vim
```
[root@192 ~]# vim test2
```
4. 通过另一个终端，查询两个进程。
```
[root@192 ~]# ps aux | grep vim
root      70333  0.0  0.2 151888  5480 pts/3    S+   16:47   0:00 vim test2
root      74209  0.1  0.2 151888  5500 pts/1    S+   21:56   0:00 vim test1
root      74211  0.0  0.0 112676   972 pts/0    S+   21:56   0:00 grep --color=auto vim
[root@192 ~]# 
```
5. 发送信号15 和信号9 ，观察两个终端程序状态。
```
[root@192 ~]# kill -15 74209
[root@192 ~]# kill -9 70333
[root@192 ~]# 
```
观察两个终端，一个正常终止，一个非法杀死
test1
```
[root@192 ~]# vim test1
Vim: Caught deadly signal TERM

Vim: Finished.
```
test2
```
已杀死
[root@192 ~]#    
```

## 5. 进程优先级 nice

### 5.1 简介
Linux 进程调度及多任务    
每个CPU在一个时间点上只能处理一个进程，通过时间片技术，来同时运行多个程序。

### 5.2 优先级范围和特性
#### 5.2.1 图示
![](https://img.istarry.top/i/2025/07/22/fr021z.png)

#### 5.2.2系统中两种优先级
在top中显示的优先级有两个，PR值和nice值    

NI: 实际nice值    
PR（+20）: 将nice级别显示为映射到更大优先级队列，-20映射到0，+19映射到39

#### 5.2.3 优先级特性
nice 值越大： 表示优先级越低，例如+19
nice 值越小： 表示优先级越高，例如-20

### 5.3 查看进程的nice级别
```
[root@192 ~]# ps axo pid,command,nice --sort=-nice | head -6
   PID COMMAND                      NI
    33 [khugepaged]                 19
   713 /usr/sbin/alsactl -s -n 19   19
  2267 /usr/libexec/tracker-extrac   -
  2272 /usr/libexec/tracker-miner-   -
  2278 /usr/libexec/tracker-miner-   -
[root@192 ~]# 
```

### 5.4 启动具有不同nice级别的进程
1. 默认情况
启动进程时，通常会继承父进程的 nice级别，默认为0。
2. 手动启动不同`nice`
```
[root@192 ~]# nice -n -5 sleep 6000 &
[3] 75120
[root@192 ~]# nice -n -5 sleep 6000 &
[4] 75121
[root@192 ~]# ps axo command,pid,nice | grep sleep
sleep 6000                   75104  -5
sleep 6000                   75105  -5
sleep 60                     75119   0
sleep 6000                   75120  -5
sleep 6000                   75121  -5
grep --color=auto sleep      75123   0
[root@192 ~]# 
```

### 5.5 更改现有进程的nice级别
使用shell更改nice级别
1.  创建一个睡眠示例程序。
```
[root@192 ~]# sleep 7000 &
[5] 75157
[root@192 ~]#
```
2. 修改他的nice值
```
[root@192 ~]# renice -20 75157
75157 (进程 ID) 旧优先级为 0，新优先级为 -20
[root@192 ~]# 
```
> 75157 (进程 ID) 旧优先级为 0，新优先级为 0，观察修旧的nice值。

# 三. 作业控制jobs

## 1. 简介
作业控制是一个命令行功能，也叫后台运行。   
关键词介绍
1.`foreground`：前台进程：是在终端中运行的命令，占领终端。(fg)
2.`background`:后台进程：没有控制终端，它不需要终端的交互。看不见，但是在运行。(bg)

## 2. 后台程序控制示例

### 2.1 1.观察占领前台的现象
```
[root@192 ~]# sleep 2000
```
运行一个程序，当前终端无法输入。观察占领前台的现象。   
大部分命令行输入已经无效。
`ctrl + c`退出

### 2.2 运行后台程序
```
[root@192 ~]# sleep 3000 &
[6] 75432
[root@192 ~]#
```

### 2.3 ps查询所有程序
```
[root@192 ~]# ps aux |grep sleep
root      75104  0.0  0.0 107904   612 pts/0    S<   10:01   0:00 sleep 6000
root      75105  0.0  0.0 107904   612 pts/0    S<   10:01   0:00 sleep 6000
root      75120  0.0  0.0 107904   608 pts/0    S<   10:02   0:00 sleep 6000
root      75121  0.0  0.0 107904   612 pts/0    S<   10:02   0:00 sleep 6000
root      75157  0.0  0.0 107904   612 pts/0    S<   10:03   0:00 sleep 7000
root      75432  0.0  0.0 107904   612 pts/0    S    10:27   0:00 sleep 3000
root      75521  0.0  0.0 107904   612 ?        S    10:32   0:00 sleep 60
root      75523  0.0  0.0 112676   980 pts/0    S+   10:33   0:00 grep --color=auto sleep
[root@192 ~]# 
```

### 2.4 jobs查看后台进程
```
[root@192 ~]# jobs
[1]   运行中               nice -n -5 sleep 6000 &
[2]   运行中               nice -n -5 sleep 6000 &
[3]   运行中               nice -n -5 sleep 6000 &
[4]   运行中               nice -n -5 sleep 6000 &
[5]-  运行中               sleep 7000 &
[6]+  运行中               sleep 3000 &
[root@192 ~]# 
```
> +,-代表，使用fg时，默认调动至前台的进程。先是+，后是-

### 2.5 调动后台程序至前台
```
[root@192 ~]# fg 1
nice -n -5 sleep 6000
```
> 将作业1调回到前台

### 2.6 消灭后台进程
```
[root@192 ~]# kill %1
[root@192 ~]# 
```
> 注意，“kill 1”   和   “kill   %1”  不同，
> 前者终止PID为1的进程，
> 后者杀死作业序号为1的后台程序。

### 2.7 总结
`&` 后台运行程序
`jobs` 查询后台
`kill %1` 停止后台进程

# 四. 虚拟文件系统proc

## 1. 简介
虚拟文件系统：采集服务器自身 内核、进程运行的状态信息

## 2. CPU
`/proc/cpuinfo`
```
[root@192 ~]# cat   /proc/cpuinfo
processor       : 0
vendor_id       : AuthenticAMD
cpu family      : 25
model           : 68
model name      : AMD Ryzen 7 6800H with Radeon Graphics
  ·
  ·
  ·
```
## 3. 内存
`/proc/meminfo`
```
[root@192 ~]# cat /proc/meminfo 
MemTotal:        2031912 kB
MemFree:          192132 kB
MemAvailable:     815072 kB
Buffers:            2116 kB
Cached:           737872 kB
  ·
  ·
  ·
```

## 4. 内核
`/proc/cmdline`
```
[root@192 ~]# cat /proc/cmdline 
BOOT_IMAGE=/vmlinuz-3.10.0-693.el7.x86_64 root=/dev/mapper/centos-root ro rd.lvm.lv=centos/root rd.lvm.lv=centos/swap rhgb quiet LANG=zh_CN.UTF-8
[root@192 ~]# 
```