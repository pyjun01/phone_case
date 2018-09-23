"use strict";

var Box = document.getElementsByClassName("case");
var color_canvas = document.getElementById("Choice_color"); //bar
var color_ctx = color_canvas.getContext("2d"); //barctx
var thumb = document.getElementById('thumb'); //thumb
var tcx; //click x
var tmx; //move x
var tl; //left
var tp = false; //press
var cc = document.getElementById('Choice_bw'); //b,w
var ct = cc.getContext('2d'); //b,w ctx
var bw = document.getElementById("bw");
var bcx;
var bcy; //click x,y
var bmx;
var bmy; //move x,y
var bl;
var bt; //left, top
var bp = false; //press
var lx = "255.0";
var ly = "0.0"; // last x,y
var _Color = function _Color() {
    var grd = color_ctx.createLinearGradient(0, 0, 255, 0);
    grd.addColorStop(0.0, "hsl(0,100%,50%)");
    grd.addColorStop(0.1, "hsl(0,100%,50%)");
    grd.addColorStop(1 / 6, "hsl(60,100%,50%)");
    grd.addColorStop(2 / 6, "hsl(120,100%,50%)");
    grd.addColorStop(3 / 6, "hsl(180,100%,50%)");
    grd.addColorStop(4 / 6, "hsl(240,100%,50%)");
    grd.addColorStop(5 / 6, "hsl(300,100%,50%)");
    grd.addColorStop(0.9, "hsl(360,100%,50%)");
    grd.addColorStop(1, "hsl(360,100%,50%)");
    color_ctx.fillStyle = grd;
    color_ctx.fillRect(0, 0, 255, 15);
}; //background gradient//background gradient
_Color(); //background gradient
var _ClickBar = function _ClickBar(e, target) {
    //color_canvas 클릭시
    var rect = target.getBoundingClientRect();
    if (target.id == "Choice_color") {
        var x = e.clientX - rect.left + 6;
        _Move(x, thumb, 6, 254);
    } else {
        var x = e.clientX - rect.left + 9;
        var y = e.clientY - rect.top + 37;
        _Move(x, bw, 9, 261, y);
    }
    if (e.target.id == "Choice_color") {
        var rect = color_canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var get_rgb = color_ctx.getImageData(x, y, 1, 1).data; //get rgb_code
        _ApplyColor(get_rgb);
    }
};
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
var color_code= document.getElementById("color_code");
var copy= document.getElementById("copy");
color_code.addEventListener("click",function () {
    copy.style.display= "block";
    copy.value= color_code.innerText;
    copy.select();
    try {
        var successful = document.execCommand('copy');
    } catch (err) {
        alert("텍스트 드래그후 ctrl+c해서 복사해주세요");
    }
    copy.style.display= "none";
});
var _FColor = function _FColor(x, y) {
    //아래꺼 thumb움직일때마다
    var rgb = ct.getImageData(x, y, 1, 1).data;
    var g1 = rgb[0];
    var g2 = rgb[1];
    var g3 = rgb[2];
    for(var i=0;i<Box.length;i++){
        Box[i].style.backgroundColor = "rgb(" + g1 + "," + g2 + "," + g3 + ")"; //stroke
    }
    color_code.innerText=rgbToHex(g1, g2, g3);
};
var _ApplyColor = function _ApplyColor(g) {
    //위에꺼 thumb움직일때마다
    /* box fill */
    thumb.style.background = "rgb(" + g[0] + "," + g[1] + "," + g[2] + ")"; //thumb
    for (var i = 0; i <= 255; i++) {
        var grd = color_ctx.createLinearGradient(0, 0, 0, 255);
        var g1 = 255 - (255 - g[0]) / 255 * i;
        var g2 = 255 - (255 - g[1]) / 255 * i;
        var g3 = 255 - (255 - g[2]) / 255 * i;
        grd.addColorStop(0.1, "rgb(" + g1 + "," + g2 + "," + g3 + ")");
        grd.addColorStop(1, "rgb(0,0,0)");
        ct.fillStyle = grd;
        ct.fillRect(i, 0, 1, 255);
    }
    _FColor(((parseInt(bw.style.left, 10) - 9) * (255 / 252)).toFixed(1),((parseInt(bw.style.top, 10) - 37) * (255 / 255)).toFixed(1));
    // _FColor(lx, ly);
    /* //box fill */
}; //apply color
var _Move = function _Move(x, t, min, max) {
    var y = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
    //move thumb
    if (y != false) {
        if (291 < y) {
            t.style.top = "291px";
        } else if (y < 37) {
            t.style.top = "37px";
        } else {
            t.style.top = y + "px";
        }
    }
    if (max < x) {
        t.style.left = max + "px";
    } else if (x < min) {
        t.style.left = min + "px";
    } else {
        t.style.left = x + "px";
    }
};
var _ApplyBw = function _ApplyBw(rgb) {
    for(var i=0;i<Box.length;i++){
        Box[i].style.backgroundColor = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
    }
};
_ApplyColor(color_ctx.getImageData(0, 1, 1, 1).data);
color_canvas.addEventListener("mousedown", function (e) {
    //bar click
    _ClickBar(e, color_canvas);
    tcx = e.clientX;
    tl = parseInt(thumb.style.left, 10);
    tp = true;
}); //bar click
thumb.addEventListener("mousedown", function (e) {
    //thumb click
    tcx = e.clientX;
    tl = parseInt(thumb.style.left, 10);
    tp = true;
}); //thumb click
cc.addEventListener("mousedown", function (e) {
    _ClickBar(e, cc);
    bcx = e.clientX;
    bl = parseInt(bw.style.left, 10);
    bcy = e.clientY;
    bt = parseInt(bw.style.top, 10);
    bp = true;

    var rect = bw.getBoundingClientRect();
    bmx = e.clientX;
    bmy = e.clientY;
    var x = bmx - bcx + bl;
    var y = bmy - bcy + bt;
    _Move(x, bw, 9, 261, y);
    var gx = ((parseInt(bw.style.left, 10) - 9) * (255 / 252)).toFixed(1); //get x 9~216 252*x=255
    var gy = ((parseInt(bw.style.top, 10) - 37) * (255 / 255)).toFixed(1); //get x 37~291
    _FColor(gx, gy);
}); //명도 채도조절박스
bw.addEventListener("mousedown", function (e) {
    bcx = e.clientX;
    bl = parseInt(bw.style.left, 10);
    bcy = e.clientY;
    bt = parseInt(bw.style.top, 10);
    bp = true;
}); //명도 채도조절thumb
window.addEventListener("mousemove", function (e) {
    //click->move
    if (tp) {
        //위에꺼
        var rect = thumb.getBoundingClientRect();
        tmx = e.clientX;
        var x = tmx - tcx + tl;
        _Move(x, thumb, 6, 254);
        var gx = ((parseInt(thumb.style.left, 10) - 6) * (255 / 249)).toFixed(1); //get x
        var get_rgb = color_ctx.getImageData(gx, 1, 1, 1).data; //get x.colordata
        _ApplyColor(get_rgb);
    }
    if (bp) {
        //아래꺼
        var rect = bw.getBoundingClientRect();
        bmx = e.clientX;
        bmy = e.clientY;
        var x = bmx - bcx + bl;
        var y = bmy - bcy + bt;
        _Move(x, bw, 9, 261, y);
        var gx = ((parseInt(bw.style.left, 10) - 9) * (255 / 252)).toFixed(1); //get x 9~216 252*x=255
        var gy = ((parseInt(bw.style.top, 10) - 37) * (255 / 255)).toFixed(1); //get x 37~291
        _FColor(gx, gy);
    }
});
window.addEventListener("mouseup", function (e) {
    if (tp) //위에꺼
        tp = !tp;
    if (bp) {
        //아래꺼
        bp = !bp;
        lx = ((parseInt(bw.style.left, 10) - 9) * (254 / 252)).toFixed(1); //get x 9~216 252*x=255
        ly = ((parseInt(bw.style.top, 10) - 37) * (254 / 255)).toFixed(1); //get x 37~291
    }
}); //click->move->up
/* //setColor */
