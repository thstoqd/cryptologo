# Formspree 配置指南

## 📧 设置邮件通知服务

为了让提交表单正常工作，需要配置 Formspree 邮件服务。

### 步骤 1：注册 Formspree 账号

1. 访问 [Formspree.io](https://formspree.io/)
2. 点击 "Sign Up" 注册账号（免费版每月 50 次提交）
3. 验证邮箱

### 步骤 2：创建表单

1. 登录后，点击 "New Form"
2. 表单名称：`Cryptologo Token Submission`
3. 接收邮箱：`begooddabao@gmail.com`
4. 点击 "Create Form"

### 步骤 3：获取 Form ID

创建表单后，你会看到一个 Form Endpoint URL，格式如下：
```
https://formspree.io/f/YOUR_FORM_ID
```

例如：
```
https://formspree.io/f/xpzgkqyz
```

### 步骤 4：更新代码

在 `app/submit/page.tsx` 文件中，找到这一行：

```typescript
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'
```

将 `YOUR_FORM_ID` 替换为你的实际 Form ID：

```typescript
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xpzgkqyz'
```

### 步骤 5：测试

1. 保存文件
2. 重新构建项目（如果已部署）
3. 访问 `/submit` 页面
4. 填写测试表单并提交
5. 检查邮箱 `begooddabao@gmail.com` 是否收到邮件

## 📨 邮件内容格式

Formspree 会发送包含以下信息的邮件：

- **Email**: 用户邮箱
- **Token Name**: 代币名称
- **Token Symbol**: 代币符号
- **Website**: 官网链接（如果有）
- **Category**: 选择的分类（最多3个）
- **Description**: 描述（如果有）
- **SVG Link**: SVG Logo 链接
- **Submitted At**: 提交时间

## 🔧 可选配置

### 自定义邮件模板

在 Formspree 后台可以：
- 自定义邮件主题
- 自定义邮件内容格式
- 添加自动回复

### 增加提交限制

如果每月提交超过 50 次，可以升级到付费计划。

## ⚠️ 注意事项

1. **免费版限制**：每月 50 次提交
2. **垃圾邮件过滤**：确保邮件不会被标记为垃圾邮件
3. **API 限制**：Formspree 有速率限制，避免频繁提交

## 🆘 问题排查

如果邮件没有收到：

1. 检查垃圾邮件文件夹
2. 确认 Form ID 是否正确
3. 检查 Formspree 后台的提交记录
4. 确认邮箱地址 `begooddabao@gmail.com` 正确

