---
title: "Linux 安全基础指南"
date: "2025-03-10"
description: "从零开始构建 Linux 安全知识体系——用户权限、防火墙配置、日志审计与入侵检测的基础概念。"
tags:
  - Linux
  - Security
category: "Linux/Security"
---

## 为什么 Linux 安全重要

Linux 是服务器领域的事实标准。无论是云服务器、容器化部署还是嵌入式设备，Linux 无处不在。理解其安全原理是每个后端工程师和 DevOps 从业者的必修课。

## 核心安全领域

- **用户与权限管理** — `chmod`、`chown`、`sudo`、PAM 认证模块
- **网络防火墙** — `iptables`、`nftables`、`firewalld`
- **日志与审计** — `journald`、`auditd`、日志集中管理
- **入侵检测** — 文件完整性监控、异常行为检测
- **安全增强** — SELinux、AppArmor

## 下一步

了解基础概念后，可以深入具体的工具实践——例如 Wazuh 作为开源 SIEM 的部署与使用。
