---
title: "centos文件和用户管理"
date: "2025-07-14"
description: "本文系统讲解 CentOS 系统的文件与用户管理，涵盖 Linux 单根目录结构、核心目录功能、文件操作命令，以及用户/组管理，最后介绍 su 和 sudo 提权机制."
tags:
  - cloud computing
  - Linux
cover: "https://picsum.photos/seed/digital-garden/1200/630"
---

# 一、文件管理

## 1.Linux目录结构

### 1.1 对比
- Windows：以多根的方式组织文件 `C:\ D:\ E:\`
- Linux：以单根的形式组织文件 `/`

### 1.2 简介
`/`目录结构：
```
[root@localhost /]# ls    
bin  boot  dev  etc  home  lib  lib64  media  mnt      
opt  proc  root  run  sbin  srv  sys  tmp  usr  var
[root@localhost /]#     
```

### 1.3 目录图示
![/Table of contents](https://img.istarry.top/i/2025/07/14/p6x857.jpg)
目录功能了解即可:
- bin 普通用户使用的命令 /bin/ls, /bin/date
- sbin 管理员使用的命令 /sbin/service 
- dev 设备文件 /dev/sda,/dev/sda1
- root root用户的HOME
- home 存储普通用户家目录 

- tmp 临时文件(全局可写：进程产生的临时文件) 
- var 存放的是一些变化文件，比如数据库，日志，邮件....

==设备（主要指存储设备）挂载目录==
- media 移动设备默认的挂载点
- mnt 手工挂载设备的挂载点

- etc 配置文件（系统相关如网络/etc/sysconfig/network
- proc 虚拟的文件系统，反映出来的是内核，进程信息或实时状态 ,硬件的状态

==sr 系统文件，相当于C:\Windows==
- /usr/local 软件安装的目录，相当于C:\Program

- boot 存放的系统启动相关的文件，例如kernel,grub(引导装载程序)

- lib 库文件Glibc
- lib64 库文件Glibc

- lost+found fsck修复时，存储没有链接的文件或目录

## 2.文件管理

### 2.1 文件管理命令

#### 2.1.1 创建文件
> 语法：命令 空格 文件名.后缀
> touch 文件名字
```
[root@localhost ~]# touch file1.txt
[root@localhost ~]# ls
anaconda-ks.cfg  file1.txt  initial-setup-ks.cfg
[root@localhost ~]# 
```

#### 2.1.2 创建目录
> 语法：命令 空格 路径和目录名
> mkdir -p (父系，当创建目录没有上一级时，自动创建)
```
[root@localhost ~]# ls
anaconda-ks.cfg  dir1  file1.txt  initial-setup-ks.cfg
[root@localhost ~]# 
```

#### 2.1.3 复制
> 语法：命令 参数1 参数2
> cp 源文件路径 目标文件夹
> 选项：cp -r 源目录 目标目录
```
[root@localhost ~]# cp file1.txt dir1/
[root@localhost ~]# ls dir1/
file1.txt
[root@localhost ~]# ls
anaconda-ks.cfg  dir1  file1.txt  initial-setup-ks.cfg
[root@localhost ~]# 

```

#### 2.1.4 移动
> 语法：命令 参数1 参数2
> mv 源文件路径 目标文件路径
```
[root@localhost ~]# mv file2.txt dir1/
[root@localhost ~]# ls
anaconda-ks.cfg  dir1  file1.txt  initial-setup-ks.cfg
[root@localhost ~]# ls dir1/
file1.txt  file2.txt
[root@localhost ~]#
```

#### 2.1.5 删除
> 语法：rm -rf 文件或目录路径
```
[root@localhost ~]# touch file3.txt file4.txt
[root@localhost ~]# ls
anaconda-ks.cfg  dir1  file1.txt  file3.txt  file4.txt  initial-setup-ks.cfg
[root@localhost ~]# rm -rf file3.txt file4.txt 
[root@localhost ~]# ls
anaconda-ks.cfg  dir1  file1.txt  initial-setup-ks.cfg
[root@localhost ~]# 
```

#### 2.1.6 查看
> 在图形界面，创建一个记事本，或者直接创建一个`.xt`,并写入内容
> cat全部 
> more翻页
> head头部
> tail尾部
```
[root@localhost ~]# cat /root/file6.txt 
Hello Linux
Hello Centos
[root@localhost ~]# more /root/file6.txt 
Hello Linux
Hello Centos
[root@localhost ~]# head /root/file6.txt 
Hello Linux
Hello Centos
[root@localhost ~]# tail /root/file6.txt 
Hello Linux
Hello Centos
[root@localhost ~]
```
> grep过滤关键字
> 语法：grep 关键字 文件名
```
[root@localhost ~]# grep Hello file6.txt 
Hello Linux
Hello Centos
[root@localhost ~]# 
```

#### 2.1.7 修改文件内容VI/VIM

##### 2.1.7.1 vi的三个模式
基本上 vi/vim 共分为三种模式，命令模式（Command Mode）、输入模式（Insert Mode）和命令行模式（Command-Line Mode）

##### 2.1.7.2 命令模式
- 光标定位 
    - hjkL              //上下左右
    - 0 $               //行首行尾
    - gg G 			//页首页尾
    - 3G 进入第三行  
    - /string (n N 可以循环的)     //查找字符，按n键选下一个（重要）
- 文本编辑
    - yy 复制
    - dd 删除
    - p 粘贴
    - u undo撤销
- 进入其他模式
    - a 进入插入模式
    - i 进入插入模式
    - o 进入插入模式
    - A 进入插入模式
    - : 进入末行模式（扩展命令模式）
    - v 进入可视模式
    - ESC 返回命令模式

##### 2.1.7.3 扩展命令模式
- 保存退出
    - :w 保存 
    - :q 退出 
    - :wq 保存并退出 
- 查找替换
    - :范围 s/原内容/新内容/全局 
    - :1,5 s/root/qianfeng/g          从1－5行的root 替换为qianfeng 
- 另存为
    - :w file9.txt 另存为 file9.txt
- 设置
    - :set nu 设置行号 
    - :set nonu 取消设置行号 
    - :set list 显示控制字符

#### 2.1.8 改变目录
- cd 绝对路径
- ls 列出目录当中的内容

##### 2.1.8.1 绝对路径
从根开始描述路径。

##### 2.1.8.2 相对路径
- 当前
    - ./
    - 不输入任何路径
- 上一级
    - ../

### 2.2 文件类型

#### 2.2.1 类型
- 常见类型
    - 普通文件（文本文件，二进制文件，压缩文件，电影，图片。。。）
    - d 目录文件（蓝色）
- 非常见类型
    - b 设备文件（块设备）存储设备硬盘，U盘 /dev/sda, /dev/sda1
    - c 设备文件（字符设备）打印机，终端 /dev/tty1
    - l 链接文件（淡蓝色）
    - s 套接字文件
    - p 管道文件

#### 2.2.2 注意
> 通过颜色判断文件的类型是不一定正确的！！！
> Linux系统中文件是没有扩展名！！！

# 二、用户管理

## 1.用户/组基本概念

### 1.1 概念
Users and groups：
. Every process (running program) on the system runs as a particular user.
. Every file is owned by a particular user. 
. Access to files and directories are restricted by user. 
. The user associated with a running process determines the files and directories accessible to that process.

### 1.2 用户的作用

#### 1.2.1 查看当前登录的用户信息
```
[root@192 ~]# id
uid=0(root) gid=0(root) 组=0(root) 环境=unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023
[root@192 ~]# 

```

#### 1.2.2 查看文件的owner
```
[root@192 ~]# ll /home
总用量 4
drwx------. 14 usr1 usr1 4096 7月  14 19:00 usr1
[root@192 ~]# 
```

#### 1.2.3 查看运行进程的username
```
[root@192 ~]# ps aux
USER        PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root          1  0.0  0.3 193700  6852 ?        Ss   08:30   0:02 /usr/lib/systemd/systemd --switched-root --system --deserialize 21
root          2  0.0  0.0      0     0 ?        S    08:30   0:00 [kthreadd]
root          3  0.0  0.0      0     0 ?        S    08:30   0:00 [ksoftirqd/0]
root          4  0.0  0.0      0     0 ?        S    08:30   0:00 [kworker/0:0]
root          5  0.0  0.0      0     0 ?        S<   08:30   0:00 [kworker/0:0H]
root          7  0.0  0.0      0     0 ?        S    08:30   0:00 [migration/0]
root          8  0.0  0.0      0     0 ?        S    08:30   0:00 [rcu_bh]
root          9  0.0  0.0      0     0 ?        S    08:30   0:01 [rcu_sched]
root         10  0.0  0.0      0     0 ?        S    08:30   0:00 [watchdog/0]
root         11  0.0  0.0      0     0 ?        S    08:30   0:00 [watchdog/1]
root         12  0.0  0.0      0     0 ?        S    08:30   0:00 [migration/1]
root         13  0.0  0.0      0     0 ?        S    08:30   0:00 [ksoftirqd/1]
    .
    .
    .    
```

### 1.3 用户组信息存储的文件

#### 1.3.1 用户基本信息文件
> /etc/passwd（冒号分割为7列字段）
> root:x:0:0:root:/root:/bin/bash
> 用户名:x:uid:gid:描述:HOME:shell

- root:用户名：登录系统的名字
- X:密码占位符:，具体内容不在这里
- 0:UID: 用户的身份证号
    - 系统约定： RHEL7--9
    - uid: 0 特权用户
    - uid: 1~999 系统用户
    - uid: 1000+ 普通用户
> The root user
> . uid is 0
> . all power
> . This user has the power to override normal privileges on the file system
> . installing or removing software and to manage system files and directorie
> . Most devices can only be controlled by root
- 0:GID:GROUP 组号
    - 每创建一个用户，系统会自动创建同名的组
- root:描述：比如经理 manager
    - 默认是用户名
- /root:家目录：登录系统时，所在目录
- /bin/bash:登录shell：命令解释器
> 不能用vim的方式改这个文件，主要是来观察

#### 1.3.2 用户密码信息文件
`/etc/shadow(9列)`   
`root:$1$MYG2N:15636:0:99999:7:   :   :`

#### 1.3.4 组信息文件
`/etc/group `   
`root:x:0:`   
组名:组密码:组ID:组成员
> 组成员默认为空

## 2.用户/组管理

### 2.1 用户

#### 2.1.1 ＝＝创建用户 未指定选项＝＝
```
[root@192 ~]# useradd user01
[root@192 ~]# id user01
uid=1001(user01) gid=1001(user01) 组=1001(user01)
[root@192 ~]# 
```
> 用户编号=具体数字（用户名）  组编号=具体数字（组名）  组=组ID（成员名字）
> 小结：
> 如果创建一个用户时，未指定任何选项，系统会创建一个和用户名相同的组作为用户的Primary Group.

#### 2.1.2 ＝＝创建用户    指定选项＝＝
```
[root@192 ~]# useradd user02 -u 2101
[root@192 ~]# id user02
uid=2101(user02) gid=2101(user02) 组=2101(user02)
[root@192 ~]# 
```
> 创建用户user02，指定uid
```
[root@192 ~]# useradd user03 -d /user03
[root@192 ~]# id user03
uid=2102(user03) gid=2102(user03) 组=2102(user03)
[root@192 ~]# 
```
> 创建用户user03 指定家目录

#### 2.1.3 ＝＝删除用户＝＝＝＝＝＝＝＝
```
[root@192 ~]# userdel -r user03
[root@192 ~]# id user03
id: user03: no such user
[root@192 ~]# 
```

#### 2.1.4 ＝＝用户密码＝＝＝＝＝＝＝＝
方法一：root修改其他用户（alice）密码
```
[root@192 ~]# passwd user02
更改用户 user02 的密码 。
新的 密码：
重新输入新的 密码：
passwd：所有的身份验证令牌已经成功更新。
[root@192 ~]# 
```

方法二：用户（mark）登录，自己修改密码。
```
[mark@localhost ~]$ passwd
```

#### 2.1.5 ＝＝其它选项管理＝＝＝＝＝＝＝
```
[root@localhost ~]# usermod -s /sbin/nologin   user02
```
修改登录SHELL

#### 2.1.6 ＝＝组成员管理＝＝＝＝＝＝＝＝
1. 查看用户原先信息
```
[root@192 ~]# id user02
uid=2101(user02) gid=2101(user02) 组=2101(user02)
[root@192 ~]#
```
2. 将用户追加到is组
> 语法：usermod -aG 组名 用户名
```
[root@192 ~]# usermod     user02    -aG is
[root@192 ~]#  
```
3. 再次查看用户信息
```
[root@192 ~]# id user02
uid=2101(user02) gid=2101(user02) 组=2101(user02),2102(is)
[root@192 ~]# 
```
4. 将用户移除组（扩展）
```
[root@192 ~]# gpasswd   -d    user02    is
正在将用户“user02”从“is”组中删除
[root@192 ~]# 
```

### 2.2 用户组

#### 2.2.1 操作
1. 创建一个ir组   
`创建一个ir组`   
查看
```
[root@192 ~]# tail -3 /etc/group
user02:x:2101:
is:x:2102:
ir:x:2103:
[root@192 ~]# 
```
> 说明该组已经 创建，但和任何用户都没有关系。

2. 创建组net01，并指定gid 1007
```
[root@192 ~]# groupadd net01 -g   1007
[root@192 ~]# 
```
查看
```
[root@192 ~]# grep 'net01' /etc/group
net01:x:1007:
[root@192 ~]# 
```
> //查看/etc/group中组net01信息
3. 删除组   
`groupdel net01`   
查看   
```
[root@192 ~]# tail -3 /etc/group
user02:x:2101:
is:x:2102:
ir:x:2103:
[root@192 ~]# 
```

#### 2.2.2 分类
- 基本组
    - 随用户创建，自动创建的同名组
- 附加组
    - 用户加入的其他组。

## 3.提权

### 3.1 永久提权Switching users with su
```
[user01@localhost ~]$ id user01
uid=1003(user01) gid=1003(user01) 组=1003(user01)
[user01@localhost ~]$ whoami
user01
[alice@localhost ~]$ useradd u1
-bash: /usr/sbin/useradd: 权限不够
[alice@localhost ~]$ su       -         root
password：
[root@localhost ~]# useradd u1
成功
```

### 3.2 临时提权Running commands as root with sudo

#### 3.2.1 sudo简介
1. 简介
使普通用户，执行某些特权命令。

2. sudo的工作原理
- 将当前用户切换到超级用户下
- 然后以超级用户身份执行命令，执行完成后，直接退回到当前用户。
- 具体工作过程如下：
    - 当用户执行sudo时，系统会主动寻找/etc/sudoers文件，判断该用户是否有执行sudo的权限
    - -->确认用户具有可执行sudo的权限后，让用户输入用户自己的密码确认
    - -->若密码输入成功，则开始执行sudo后续的命令

#### 3.2.2 sudo配置文件语法
1. 语法： `user    MACHINE=COMMANDS`
2. 用户 登录的主机=（可以变换的身份） 可以执行的命令 
    - 找到 root ALL=(ALL) ALL 这一行，在其下新增新的为你的用户提权的语句，其格式如下：
        - 用户名或组名 机器=（表示以谁的身份执行）命令
    - 以 root ALL=(ALL) ALL 这一行讲解一下，如下：
        - root 表示用户名,如果是用户组，加百分号，这样写 ：%组名
        - ALL 表示允许登录的主机，ALL就表示允许任意主机
        - （ALL）表示以谁的身份执行，ALL表示root身份
        - ALL 表示当前用户可以执行的命令，多个命令需要使用英文道号分割
```
zhangsan ALL=(ALL) NOPASSWD: /usr/sbin/reboot,/usr/sbin/useradd,/usr/sbin/userdel
```
> 这里加了一个NOPASSWD: 表示提权执行命令时不需要要输入用户密码，默认不加是需要输如用户密码的

#### 3.2.3 目标
这里加了一个NOPASSWD: 表示提权执行命令时不需要要输入用户密码，默认不加是需要输如用户密码的

#### 3.2.4 示例1

##### 3.2.4.1 超管编辑授权信息
1. 以root身份，授权普通用户zhangsan
2. 系统的授权文件
```
[root@localhost ~]# vim /etc/sudoers
``` 
3. 这里加了一个NOPASSWD: 表示提权执行命令时不需要要输入用户密码，默认不加是需要输如用户密码的
```
zhangsan ALL=(ALL) NOPASSWD: /usr/sbin/reboot,/usr/sbin/useradd,/usr/sbin/userdel
```
4. 查看当前特殊权限 
```
[root@localhost ~]# sudo -l
```

##### 3.2.4.2 创建zhangsan用户账号
创建zhangsan账号
```
[root@localhost ~]# useradd zhangsan
```

##### 3.2.4.3 切换用户登录
1. 用户需要密码
`# passwd  zhangsan`
2. 切换用户zhangsan登陆   
该用户一定要注销后登陆，否则会有缓存不生效

##### 3.2.4.4 使用sudo提权
```
[zhangsan@localhost ~]$ useradd gougou10
-bash: /usr/sbin/useradd: 权限不够
[zhangsan@localhost ~]$ sudo useradd gougou10
[zhangsan@localhost ~]$ id gougou10
uid=1002(gougou10) gid=1002(gougou10) 组=1002(gougou10)
```