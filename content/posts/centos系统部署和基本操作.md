---
title: "centos系统部署和基本操作"
date: "2025-07-01"
description: "本文详细记录了在 VMware 中部署 CentOS 7 系统的完整流程，涵盖 Linux 发行版选择、镜像获取、虚拟机配置、系统安装及初始设置；同时介绍了基础命令操作."
tags:
  - cloud computing
  - Linux
cover: "https://picsum.photos/seed/digital-garden/1200/630"
---

## 一、linux发行版本介绍

1. RHEL
2. Centos
3. Ubuntu
4. Debian

## 二、获取Linux镜像&安装VMware

### 2.1获取Linux镜像

#### 2.1.1 官方网站获取

![img](https://img.istarry.top/i/2025/07/01/ialsed.png) 跳转[Centos官方网站](https://www.centos.org/) ![img](https://img.istarry.top/i/2025/07/01/ibq8yy.png) 跳转[Unbutu官方网站](https://ubuntu.com/)

#### 2.1.2 镜像站获取

由于国外下载速度会比较慢，我们可以选择国内镜像站下载

> 企业镜像站

[阿里巴巴开源镜像站](https://developer.aliyun.com/mirror)
[华为开源镜像站](https://mirrors.huaweicloud.com/)
[腾讯开源镜像站](https://mirrors.cloud.tencent.com/)
[网易开源镜像站](http://mirrors.163.com/)
[搜狐开源镜像站](http://mirrors.sohu.com/)

> 大学镜像站

[清华大学开源镜像站](https://mirrors.tuna.tsinghua.edu.cn/)
[华中科技大学开源镜像站](http://mirror.hust.edu.cn/)
[浙江大学开源镜像站](http://mirrors.zju.edu.cn/)
[北京理工大学开源镜像站](http://mirror.bit.edu.cn/)
[中国科技大学开源镜像站](http://mirrors.ustc.edu.cn/)

### 2.2 安装VMware

可以去EthanSong`大佬的博客园去查看[VMware Workstation Pro 免费版下载和安装指南](https://www.cnblogs.com/EthanS/p/18211302)
这里就不过多描述

## 三、Linux系统部署

### 3.1 服务器介绍

> 物理服务器 -> 服务器机柜 -> 互联网数据中心

#### 3.1.1 物理服务器(Physical Server)

- 塔式服务器(Tower Server):塔式服务器的外观类似于普通的台式机主机箱，呈“塔形”结构。
- 机架式服务器(Rack Serer):机架式服务器是为统一安装在**标准机柜（Rack）**中设计的，通常为扁平的金属外壳，按“U”为单位（1U = 1.75英寸）划分高度。
- 刀片式服务器(Blade Server):刀片服务器是一种高密度服务器架构，将多个“刀片”（即精简的服务器模块）插入到一个统一的刀箱（Enclosure）中。

#### 3.1.2 服务器机柜(Server Rack/Server Cabinet)

服务器机柜是一种专门用于集中安装、存放和管理服务器及相关网络设备的金属框架或封闭式柜体。
它就像是“服务器的衣橱”，能让多个设备有序地安装在一个统一结构中。

#### 3.1.3 互联网数据中心(IDC)

互联网数据中心（IDC），指的是一个专门用于集中存放服务器、网络设备、存储设备的高标准机房，并为用户提供高速网络、电力保障、安全管理、设备托管等综合服务的基础设施平台。
简单来说，IDC 就是“服务器的高级住宅小区+运维管家”。

### 3.2 通过VMware部署Centos系统

1.安装并打开VMWARE（使用管理员身份运行）   
2.在VMware中新建虚拟机   
3.典型/自定义，选择自定义安装   
4.虚拟机兼容性，默认下一步   
5.安装来源，选择稍后安装操作系统   
6.操作系统类型，选择linux centos7 64   
8.自定义虚拟机名称，和文件夹位置。   
9.虚拟机CPU，默认下一步  
10.内存选择，2024MB  
11.网络连接，使用网络地址转换NAT。默认下一步  
12.IO类型，默认下一步  
13.虚拟磁盘类型，默认下一步   
14.创建新磁盘，默认下一步  
15.磁盘大小，默认下一步，20G  
16.磁盘文件名，默认下一步  
17.完成  
18.在新的虚拟机，选择DVD,，选择使用ISO 镜像，选择CENTOS7 安装镜像  
19.开启此虚拟机  
20.install centos 9 安装操作系统  
21.简体中文  
22.软件选择    
   22.1 带GUI的服务器(Server with GUI)    
   22.2 兼容   
   22.3 开发   
23.安装位置->默认选择完成(自动分区)   
24.网络配置->以太网打开   
25.点击开始安装   
26.设置Root密码   
27.同意许可，完成配置   
28.时区，用户名，密码   
> 恭喜你，获得了第一台私有云服务器系统。掌握了部署Linux服务器系统的技术

## 四、Linux系统基本操作

### 4.1一些命令

#### 4.1.1 登录Root用户
```
su root
```
SSH远程登录
```bash
sudo vi /etc/ssh/sshd_config
```
找到`#PermitRootLogin yes`取消注释，并确定为`yes`

```bash
sudo systemctl restart sshd
```
最后使用
```bash
ssh root@服务器IP # 或者在SSH客户端工具中登录
```

#### 4.1.2 打开文件夹，删除文件

```bash
cd ~ # 打开主文件夹（即当前用户的 Home 目录） 如果你是 root 用户，主目录是 /root；如果你是普通用户，比如 usr1，那就是 /home/usr1

cd /home/用户名  # 手动进入任意用户的目录

touch test.txt  # 创建文件

echo "Hello World" > hello.txt # 创建带内容的文件

rm test.txt #  删除一个文件

mkdir myfolder  # 创建一个文件夹

rm -r myfolder  # 删除一个文件夹

mv  test1  test2  # 改名

init 0  # 关机
```

#### 4.1.3 改变目录

```bash
cd /root/桌面
```

实操建议：
```bash
pwd  # 查看当前路径

cd /var/log  # 切换绝对路径

cd ../../etc  # 切换相对路径
```

##### 4.1.3.1 相对路径
简介:相对路径是指 使用“./”或 "../"  作为路径的开始
> 特点：不依赖当前工作目录。   
路径是完整的，始终指向同一个位置。   
通常以 / 开头（在 Linux 中）。

实例：
```bash
/root/myfile.txt
/home/junyi/documents/report.txt
/usr/local/bin/python

```
##### 4.1.3.2 绝对路径
简介：绝对路径是指 使用“/”开始的路径
> 特点：路径的含义会随当前目录不同而变化。   
更适合脚本、可移植项目中使用。

示例:
```bash
documents/report.txt      # 相对路径 -> /home/junyi/documents/report.txt
../shared/data.csv        # 上一级目录 -> /home/shared/data.csv
./temp/cache.log          # 当前目录的 temp 子目录 -> /home/junyi/temp/cache.log

```