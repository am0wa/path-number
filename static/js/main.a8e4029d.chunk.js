(this["webpackJsonppath-number"]=this["webpackJsonppath-number"]||[]).push([[0],{32:function(e,t,n){e.exports=n.p+"static/media/logo.5d5d9eef.svg"},33:function(e,t,n){e.exports=n(44)},38:function(e,t,n){},42:function(e,t,n){},44:function(e,t,n){"use strict";n.r(t);var a,c,o=n(0),r=n.n(o),u=n(27),l=n.n(u),i=(n(38),n(17)),m=n(18),s=n(21),p=n(20),h=n(23),f=n(48),d=n(47),b=n(29),k=n.n(b),g=n(30),v=n.n(g),E=n(22),I=n.n(E),C=n(31),y=n.n(C),N=n(28),w=n.n(N);!function(e){e.Unidentified="Unidentified",e.CapsLock="CapsLock",e.Alt="Alt",e.Control="Control",e.Fn="Fn",e.Shift="Shift",e.Enter="Enter",e.Tab="Tab",e.SpaceBar=" ",e.Backspace="Backspace",e.Delete="Delete"}(a||(a={})),function(e){e[e.Enter=13]="Enter",e[e.Tab=9]="Tab",e[e.SpaceBar=32]="SpaceBar",e[e.Backspace=8]="Backspace",e[e.Delete=46]="Delete",e[e.Unidentified=229]="Unidentified"}(c||(c={}));var D=function(e){Object(s.a)(n,e);var t=Object(p.a)(n);function n(){var e;Object(i.a)(this,n);for(var c=arguments.length,o=new Array(c),r=0;r<c;r++)o[r]=arguments[r];return(e=t.call.apply(t,[this].concat(o))).state={numToCheckInput:"",pathNumber:void 0},e.numInputEmitter=new f.a,e.numInput$=e.numInputEmitter.asObservable(),e.onNumInputKeyUp=function(e){console.log("keyup: ".concat(e.key," code: ").concat(e.keyCode," which: ").concat(e.which," charCode: ").concat(e.charCode))},e.onNumInputKeyDown=function(t){if(console.log("keydown: ".concat(t.key," code: ").concat(t.keyCode," which: ").concat(t.which," charCode: ").concat(t.charCode)),t.key===a.Enter&&(t.preventDefault(),e.onNumInputEnter()),t.key===a.Backspace){t.preventDefault();var n=e.state.numToCheckInput.length,c=n>0?n-1:0,o=e.state.numToCheckInput.substr(0,c);e.numInputEmitter.next(o)}},e.onNumInputEnter=function(){e.cleanUp()},e.onNumInputChange=function(t){var n=t.target.value,a=e.state.numToCheckInput;n.length+1===a.length&&(t.preventDefault(),console.log("assumed Backspace")),e.numInputEmitter.next(n)},e.calculatePathNumberFromInput=function(t){var n=parseInt(t,10)||"";e.setState((function(e){return Object(h.a)({},e,{greeting:void 0,numToCheckInput:""+n})})),e.calculatePathNumber(n)},e.cleanUp=function(){e.setState({greeting:"\u2665\ufe0f",numToCheckInput:"",pathNumber:void 0})},e.calculateDatePathNumber=function(){var t=new Date,n=""+t.getFullYear()+(t.getMonth()+1)+t.getDate();e.calculatePathNumberFromInput(n)},e.calculatePathNumber=function(t){var n=e.calculateDigitsSum(t),a="Path number is: ".concat(n);console.info(a),e.setState((function(e){return Object(h.a)({},e,{pathNumber:n})}))},e.calculateDigitsSum=function(t){var n=(""+t).split("").map((function(e){return parseInt(e,10)})).reduce((function(e,t){return e+t}),0);return n<10?n:e.calculateDigitsSum(n)},e}return Object(m.a)(n,[{key:"componentDidMount",value:function(){var e=this;this.numInput$.pipe(Object(d.a)(100)).subscribe((function(t){return e.calculatePathNumberFromInput(t)}))}},{key:"render",value:function(){return r.a.createElement("div",null,this.renderCustomNumInputForm())}},{key:"renderCustomNumInputForm",value:function(){return r.a.createElement("div",{className:"path-number-form"},r.a.createElement("h2",null,"Good Luck: ",r.a.createElement(w.a,{color:"success"},this.state.pathNumber||this.state.greeting||"#")),r.a.createElement(k.a,null,r.a.createElement(v.a,{placeholder:"check number",name:"numToCheckInput",value:this.state.numToCheckInput,onChange:this.onNumInputChange,autoComplete:"off",onKeyDown:this.onNumInputKeyDown,onKeyUp:this.onNumInputKeyUp}),r.a.createElement(y.a,{addonType:"append"},r.a.createElement(I.a,{outline:!0,color:"success",onClick:this.cleanUp},"Let Go"))),r.a.createElement(I.a,{outline:!0,color:"info",onClick:this.calculateDatePathNumber},"Today's Date"))}}]),n}(o.Component),T=n(32),O=n.n(T),S=(n(42),function(e){Object(s.a)(n,e);var t=Object(p.a)(n);function n(){return Object(i.a)(this,n),t.apply(this,arguments)}return Object(m.a)(n,[{key:"render",value:function(){var e=new Date;return r.a.createElement("div",{className:"App"},r.a.createElement("header",{className:"App-header"},r.a.createElement("img",{src:O.a,className:"App-logo",alt:"logo"}),r.a.createElement(D,null)),r.a.createElement("footer",{className:"App-footer"},e.getFullYear()," | \xa9 ",r.a.createElement("a",{href:"https://bit.ly/andriim",rel:"noopener",target:"_blank"},"am0wa")," | ",r.a.createElement("a",{href:"https://bit.ly/am0wa-donate",rel:"noopener",target:"_blank"},"Donate")))}}]),n}(o.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n(43);l.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(S,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[33,1,2]]]);
//# sourceMappingURL=main.a8e4029d.chunk.js.map