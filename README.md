<a href="#en">English</a>  <a href="#zh-cn">简体中文</a>

# <a id="en">English Version</a>

## Introduction

This is a userscript that generates quotation text according to current Chinese national standard `GB/T 7714—2015`, implying that the format might be different from your expectation. 

It is advised to modify this script yourself (including translation) to meet your own standards. 

**Userscript Managers**, e.g. `TamperMonkey`, is required for this script. 

Press `Alt+Q` at any website and the quotation text will be directedly written to your clipboard. Press `Ctrl+Alt+Q` instead to edit the text in a popup window before copying. 

## Tips

1. the popup window can be dragged anywhere. 

2. Click the buttons to clarify the type of the website. 

3. In the popup window, irrational contents are marked with **red borders**. 

4. Text with format will be converted into plain text upon pasting. 

5. The dark covering behind the popup window can be removed with double click on it. 

## Principles

1. Name

> By checking `title of hostname`, `hostname` in order, and `请填写网页名称和作者` will occur if both are empty. Therefore, `XMLHttpRequest` will be used. 

2. Title

> By checking `title` `h1` `h2` `h3` `h4` `h5` `h6` `header` tags in order, `请填写网页内容标题` will occur if all are empty. 

3. Type of Website

> Set to `Z（其他）` as default. 

4. Last Modified Date

> Convert all strings matching `y-m-d`、`y/m/d`、`y年m月d日`、`m-d`、`m/d`、`m月d日` (y: 2 or 4 digits, m: 1 or 2 digits, d: 1 or 2 digits) in `body` into `Date` format, and pick out the latest date (still, not behind today) among them. `请填写网页编辑日期` will occur if nothing matches the format. 

> As a result, <strong style="color:red">matching of the date is vague, and needs to be reviewed manually afterwards</strong>. 

## Note

1. Some of the code indirectly comes from the internet. If this violates your copyright, contact me and I will delete the according part. 

2. Nework connection is required to send request. Meanwhile, DO NOT send requests frequently. 

3.This userscript is only tested with extension `TamperMonkey` in `Microsoft Edge`. There are risks that this script cannot run properly in other extensions or browsers. 





# <a id="zh-cn">简体中文版本</a>

## 简介

本用户脚本用于从网页引用时，自动生成符合`GB/T 7714—2015参考文献著录规则`的引用。需要事先安装**用户脚本管理器**，如`篡改猴`。

在任何网页上，通过按下`Alt+Q`组合键来直接生成并复制到剪贴板，按下`Ctrl+Alt+Q`组合键来生成并在弹出窗口中进一步编辑格式。

## 提示

1. 编辑格式的弹窗是可以移动的；

2. 编辑格式时，点击按钮选择类型；

3. 编辑格式的弹窗中，不合理或需要修改但未修改的内容将用**红色框**标出；

4. 若将带格式文本直接粘贴到编辑格式弹窗的输入框中，文本的格式会被自动去除；

5. 弹窗的灰色背景可以双击隐藏，以便手动复制网站信息修改格式。




## 原理

1. 网站名称

> 按照 `域名标题`、`域名` 的顺序依次检查内容，若都获取失败则显示“请填写网页名称和作者”。因此，期间会向主域名发送`XMLHttpRequest`请求。

2. 网站标题

> 按照 `title`标签、`h1`标签、`h2`标签、`h3`标签、`h4`标签、`h5`标签、`h6`标签、`header`标签 的顺序依次检查内容，若都获取失败则显示`请填写网页内容标题`。

3. 文献类型

> 未获取，默认值是`Z（其他）`。

4. 编辑日期

> 将`body`中发现的所有符合`y-m-d`、`y/m/d`、`y年m月d日`、`m-d`、`m/d`、`m月d日`（其中y为2或4位、m为1或2位、d为1或2位阿拉伯数字）格式的字符串转换成日期，并选择其中不晚于当前时间的最晚日期，若不存在符合要求的日期则显示`请填写网页编辑日期`。

> 因此，<strong style="color:red">日期的匹配是模糊的，您应当仔细检查匹配是否正确</strong>。



## 声明

1. 部分代码参考自互联网，如有侵权请联系删除；

2. 本脚本需要发送网络请求，因此请保持网络连接畅通，并注意请求不要过于频繁；

3. 仅在`Microsoft Edge`的`篡改猴`扩展上测试过脚本，不保证在其他浏览器与其他用户脚本管理器中正确运行。
