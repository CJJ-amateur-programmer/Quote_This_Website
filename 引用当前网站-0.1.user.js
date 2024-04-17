//==UserScript==
// @name         引用当前网站
// @namespace    Quote_this_site
// @version      0.1
// @description  引用当前网站，自动生成符合参考文献著录规则的引用。
// @author       You
// @include      *
// @grant        none
// @license      GPL-3.0
//==/UserScript==
(function() {
    var reminder=document.createElement("div"),
        popup_cover=document.createElement("popupcover-div"),
        popup=document.createElement("quote-div"),
        mousestartX,
        mousestartY;
    reminder.style="width:100%;color:white;position:fixed;left:0;top:0;text-align:center;opacity:100%;background-color:rgb(255,127,127);height:4vh;font-size:2vh;opacity:0;line-height:4vh;transition:opacity 0.3s";
    reminder.innerHTML=`<b>GB/T 7714—2015格式引文已复制</b>`;
    popup_cover.style="width:100%;height:100%;background-color:rgba(0,0,0,0.6);position:fixed;inset:0px;";
    popup_cover.setAttribute("ondblclick",'this.style.display="none";');
    popup.style="background-color:white;color:black;box-shadow:rgb(153,153,153) 0px 0px 2px;transform:translate(-50%,-50%);position:fixed;border:3px solid rgba(0,0,0,0.6);font-size:16px;overflow:hidden;resize:both;";
    function getMaxZIndex(){
        let arr=[...document.body.querySelectorAll("*")].map(e=>+window.getComputedStyle(e).zIndex||0);
        return arr.length?Math.max(...arr)+1:0;
    }
    function getNewestDate(str){
        var dates=str.match(/(((\d{2}|\d{4})-)?\d{1,2}-\d{1,2})|(((\d{2}|\d{4})\/)?\d{1,2}\/\d{1,2})|(((\d{2}|\d{4})年)?\d{1,2}月\d{1,2}(?=日))/gm)||[],
            y=new Date().getFullYear(),
            y_sub=y.toString().substr(0,2);
        for(var i=0;i<dates.length;i++){
            if(dates[i].match(/\d+/gm).length==2){
                dates[i]=y+"-"+dates[i];
            }
            if(!dates[i].match(/\d{4}/)){
                dates[i]=y_sub+dates[i];
            }
            dates[i]=new Date(dates[i].replace(/[年月/]/g,"-")+" 0:00");
        }
        dates.sort((a,b)=>b-a);
        while((dates[0]>new Date()||!dates[0]?.getTime())&&dates.shift());
        return dates[0]?.toLocaleDateString('zh')?.replaceAll('/','-')||"请填写网页编辑日期";
    }
    function getTitle(){
        return document.getSelection().toString()
        ||(
            document.querySelector("title")
            ||document.querySelector("h1")
            ||document.querySelector("h2")
            ||document.querySelector("h3")
            ||document.querySelector("h4")
            ||document.querySelector("h5")
            ||document.querySelector("h6")
            ||document.querySelector("header")
        )?.innerText
        ||"请填写网页内容标题";
    }
    function sleep(ms) {
        return new Promise(resolve=> setTimeout(resolve,ms));
    }
    function closePopup(){
        document.removeEventListener("mousemove",movePopup);
        document.removeEventListener("mouseup",stopMove);
        document.body.removeChild(popup);
        document.body.removeChild(popup_cover);
        document.removeEventListener("keydown",keydown_copy);
        document.addEventListener ("keydown",keydown);
    }
    function copy(){
        closePopup();
        navigator.clipboard.writeText(popup.querySelector("#quote_format").innerText.replaceAll("\n","")).then(async function(){
            reminder.style.opacity="1";
            await sleep(1500);
            reminder.style.opacity="0";
            await sleep(300);
            document.body.removeChild(reminder);
        });
    }
    popup.innerHTML=`<style>
.quote-error{
    border:solid tomato!important;
    background-color:lightpink;
}
quote-a[contenteditable=true]{
    border:thin solid #C0C0C0
}
quote-button{
    display:inline;border:ridge #C0C0C0;
    line-height:2.5;
    background-color:whitesmoke;
    cursor:pointer;
    transition:background-color 0.2s;
    padding:1% 1% 1% 1%;
    word-break:keep-all;
    box-sizing:border-box;
    -webkit-touch-callout:none;
    -webkit-user-select:none;
    -khtml-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
}
#popup_title{
    width:100%;
    height:40px;
    line-height:40px;
    box-sizing:border-box;
    background-color:rgb(255,77,64);
    color:rgb(255,255,255);
    text-align:center;
    font-weight:700;
    font-size:20px;
    cursor:move;
    -webkit-touch-callout:none;
    -webkit-user-select:none;
    -khtml-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
}
quote-button:hover{
    background-color:PaleTurquoise;
}
quote-button:active{
    opacity:75%;
}
.quote-main{
    overflow-y:scroll;
    overflow-x:hidden;
    max-height:80vh;
    width:calc(100% - 30px);
    left:0;
    top:0;
    scrollbar-width: none;/* 兼容火狐 */
    -ms-overflow-style: none;/* 兼容IE10+ */
    padding:15px;
    text-align:center;
    word-break:break-all;
}
.quote-main::-webkit-scrollbar {
    width: 0px;/* 兼容火狐 */
}
</style><div id="popup_title">编辑引用格式
<quote-div style="text-decoration:none;color:rgb(255,255,255);position:absolute;right:10px;top:0px;font-size:25px;display:inline-block;cursor:pointer;" id="close">×</quote-div>
</div>
<div class="quote-main"><b id="btn_title" style="font-size:18px">选择文献类型</b>
<br>
<quote-button data-type="DB">数据库DB</quote-button>
<quote-button data-type="CP">计算机程序CP</quote-button>
<quote-button data-type="EB">电子公告EB</quote-button><br>
<quote-button data-type="M">专著M</quote-button>
<quote-button data-type="C">论文集C</quote-button>
<quote-button data-type="N">报纸文章N</quote-button>
<quote-button data-type="J">期刊文章J</quote-button><br>
<quote-button data-type="D">学位论文D</quote-button>
<quote-button data-type="R">报告R</quote-button>
<quote-button data-type="S">标准S</quote-button>
<quote-button data-type="P">专利P</quote-button><br>
<quote-button data-type="A">析出文章A</quote-button>
<quote-button data-type="Z">未说明的文献类型Z</quote-button>
<br><b  style="font-size:18px">引文格式</b><br>
<div id="quote_format" style="text-align:left;line-height:1.5;">[<quote-a id="quote_order" spellcheck="false" contenteditable="true">1</quote-a>]
<quote-a id="quote_name" spellcheck="false" contenteditable="true"></quote-a>.
<quote-a id="quote_title" spellcheck="false" contenteditable="true"></quote-a>
[<quote-a id="quote_type">Z</quote-a>/OL].
(<quote-a spellcheck="false" contenteditable="true" id="edit_date"></quote-a>)
[<quote-a id="current_date"></quote-a>].<quote-a id="href"></quote-a>.</div><quote-button id="quote_copy" style="margin:5% 5% 5% 5%;">完成并复制</quote-button></div>`;
    popup.querySelector("#close").onclick=()=>closePopup();
    popup.querySelector("#quote_copy").onclick=()=>copy();
    var edit_a=popup.querySelectorAll('[contenteditable="true"]'),
        q_btn=popup.querySelectorAll('[data-type]'),
        q_type_a=popup.querySelector('#quote_type'),
        error_text={"quote_order":"请填写引用序号",
                    "quote_name":"请填写网页名称和作者",
                    "quote_title":"请填写网页内容标题",
                    "edit_date":"请填写网页编辑日期"};
    for(var i=0;i<edit_a.length;i++){
        edit_a[i].addEventListener("paste",function(e){
            e.preventDefault();
            let text=e.clipboardData.getData('text/plain').replaceAll("\n","");
            document.execCommand("insertText",false,text);
        });
        edit_a[i].addEventListener("mouseover",function(e){
            return false;
        });
        edit_a[i].addEventListener("keydown",function(e){
            if(e.keyCode==13){
                this.blur();
                return false;
            }
        });
        edit_a[i].addEventListener("focus",function(){
            this.removeAttribute("class")
            if(this.id=="quote_order"||this.innerText==error_text[this.id]){
                if(document.selection){
                    var textrange=document.body.createTextRange();
                    textrange.moveToElementText(this);
                    textrange.select();
                }else if(window.getSelection){
                    var range=document.createRange();
                    range.selectNodeContents(this);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range);
                }
            }
        });
        edit_a[i].addEventListener("blur",function(){
            this.innerHTML=this.innerText.replaceAll("\n","");
            if(this.id=="edit_date"){
                this.innerText=getNewestDate(this.innerText);
            }else if(this.id=="quote_order"){
                this.innerText=parseInt(this.innerText)||error_text[this.id];
            }else{
                if(this.innerText==""){
                    this.innerText=error_text[this.id];
                }
            }
            if(this.innerText==error_text[this.id]){
                this.setAttribute("class","quote-error");
            }else{
                this.removeAttribute("class");
            }
        });
    }
    for(var j=0;j<q_btn.length;j++){
        q_btn[j].addEventListener("click",function(){
            q_type_a.innerText=this.dataset.type;
            q_type_a.removeAttribute("class");
            this.parentNode.firstChild.removeAttribute("class");
        });
    }
    popup.querySelector("#popup_title").addEventListener("mousedown",e=>{
        mousestartX=e.clientX-parseInt(window.getComputedStyle(popup).getPropertyValue("left"));
        mousestartY=e.clientY-parseInt(window.getComputedStyle(popup).getPropertyValue("top"));
        document.addEventListener("mousemove",movePopup);
        document.addEventListener("mouseup",stopMove);
    });
    var movePopup=(e)=>{
        popup.style.left=(e.clientX-mousestartX)+"px";
        popup.style.top=(e.clientY-mousestartY)+"px";
    },
        stopMove=()=>{
            document.removeEventListener("mousemove",movePopup);
            document.removeEventListener("mouseup",stopMove);
        },
        keydown_copy=(e)=>{
            if (e.altKey && e.key==="q"){
                document.removeEventListener("keydown",keydown_copy);
                copy();
            }
        },
        keydown=(e)=>{
            if (e.altKey && e.key==="q"){
                popup_cover.style.display="block";
                popup.style.zIndex=(popup_cover.style.zIndex=reminder.style.zIndex=getMaxZIndex()+1)+1;
                popup.style.left=popup.style.top="50%";
                document.body.insertBefore(reminder,document.body.firstChild);
                var xhr=new XMLHttpRequest();
                xhr.onreadystatechange=function() {
                    if (xhr.readyState===4) {
                        if(e.ctrlKey){
                            document.removeEventListener("keydown",keydown);
                            document.addEventListener("keydown",keydown_copy);
                            popup.style.width="40%";
                            popup.querySelector("#quote_name").innerText=new DOMParser().parseFromString(xhr?.responseText,"text/html")?.querySelector("title")?.innerText
                            ||location.hostname
                            ||"请填写网页名称和作者";
                            popup.querySelector("#quote_title").innerText=getTitle();
                            popup.querySelector("#edit_date").innerText=getNewestDate(document.body.innerText);
                            popup.querySelector("#current_date").innerText=new Date().toLocaleDateString('zh').replaceAll('/','-');
                            popup.querySelector("#href").innerText=window.location.href;
                            popup.querySelector("#btn_title").setAttribute("class","quote-error");
                            popup.querySelector("#quote_type").setAttribute("class","quote-error");
                            for(var i=0;i<edit_a.length;i++){
                                if(edit_a[i].innerText==""){
                                    edit_a[i].innerText=error_text[edit_a[i].id];
                                }
                                if(edit_a[i].innerText==error_text[edit_a[i].id]){
                                    edit_a[i].setAttribute("class","quote-error");
                                }else{
                                    edit_a[i].removeAttribute("class");
                                }
                            }
                            document.body.append(popup_cover);
                            document.body.append(popup);
                            popup.querySelector("#quote_order").focus();
                        }else{
                            navigator.clipboard.writeText(
                                "[1]"
                                + (new DOMParser().parseFromString(xhr?.responseText,"text/html")?.querySelector("title")?.innerText||location.hostname||"请填写网页名称和作者")
                                + "."
                                + getTitle()
                                + "[OL].("
                                + getNewestDate(document.body.innerText)
                                + ")["
                                + new Date().toLocaleDateString('zh').replaceAll('/','-')
                                + "]."
                                + location.href
                                + "."
                            ).then(async function(){
                                reminder.style.opacity="1";
                                await sleep(1500);
                                reminder.style.opacity="0";
                                await sleep(300);
                                document.body.removeChild(reminder);
                            });
                        }
                    }
                }
                xhr.open("GET",location.origin,true);
                xhr.send();
            }
        }
    document.addEventListener ("keydown",keydown);
})();