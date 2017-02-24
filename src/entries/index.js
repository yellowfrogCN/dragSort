import ReactDOM from 'react-dom';
import React from 'react';
import {DragSort} from "./DragSort";

import "../less/index.less";

ReactDOM.render(
    <DragSort   
        clickElement = {(element) => {
            console.log("点中的元素是：",element);
        }}
        dragElement = {(element) => {
            console.log("拖拽的持续过程ing，被拖拽元素是：",element);
        }}
        dragOver = {(element) => {
            console.log("拖拽结束（松开鼠标的时候）",element);
        }}

        moveStop = {() => {
            console.log("每一个元素运动停止了以后（只要是点一下就会有 moveStop）");
        } }

        time="1000"//运动时间 默认500ms
        type="ease-out"//运动类型 ease-out减速 默认  ease-in加速 linear匀速 
        className="dragSort"            
    >
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
        <div>6</div>
        <div>7</div>
        <div>8</div>
        <div>9</div>
        <div>10</div>
        <div>11</div>
        <div>12</div>        
    </DragSort>,
    document.getElementById("root")
)