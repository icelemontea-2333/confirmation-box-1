
let isIceConfirmInit = false;//是否初始化

/*标题限制两字，文字限制15以内,-1代表默认*/
function openIceConfirm(title,text){
    initIceConfirm();
    let iceConfirm = new Promise((resolve,reject) => {
        /*动画*/
        if (localStorage.getItem("SKIP_ICE_ANIMATION") === "true")
            iceConfirmUtils.animationSkip();
        else
            iceConfirmUtils.animationRun();

        /*添加标题和文字*/
        if (title && title.length === 2)
            document.getElementById('iceAlertTitle').innerText = title;
        if (text && text.length <= 15 && text !== -1)
            document.getElementById('iceAlertText').innerText = text;

        /*重置写入*/
        document.getElementById('iceAlertYes').style.pointerEvents = 'auto';
        document.getElementById('iceAlertYes').innerHTML = '<span>确认</span>';
        document.getElementById('iceAlertNo').innerHTML = '<span>取消</span>';

        document.getElementById('iceAlertYes').onclick = ()=>{
            iceConfirmUtils.animationClear();
            resolve(true);
        }
        document.getElementById('iceAlertNo').onclick = ()=>{
            iceConfirmUtils.animationClear();
            resolve(false);
        }
    })
    return iceConfirm;
}

/*旧版 依次传入方法名、参数（对象，可以跳过不传）、标题、文字、模式（1：提示框 默认告警框）*/
/*标题限制两字，文字限制15以内,-1代表默认*/
/*结果receive.result、参数receive.data*/
function openIceAlert(name,value,title,text,mode){
    initIceConfirm();
    if (value === undefined)
        value = {}
    //无value的情况
    if (value.constructor !== Object && text === undefined && mode === undefined){
        text = title;
        title = value;
    }else if (value.constructor !== Object && mode === undefined){
        mode = text;
        text = title;
        title = value;
    }

    /*添加标题和文字*/
    if (title && title.length === 2)
        document.getElementById('iceAlertTitle').innerText = title;
    if (text && text.length <= 15 && text !== -1)
        document.getElementById('iceAlertText').innerText = text;

    /*动画*/
    if (localStorage.getItem("SKIP_ICE_ANIMATION") === "true")
        iceConfirmUtils.animationSkip();
    else
        iceConfirmUtils.animationRun();

    /*写入*/
    document.getElementById('iceAlertYes').style.pointerEvents = 'auto';
    document.getElementById('iceAlertYes').innerHTML = '<span onclick="choseIceAlert(' + name + ',true,' + JSON.stringify(value).replace(/\"/g, "'") +')">确认</span>';
    document.getElementById('iceAlertNo').innerHTML = '<span onclick="choseIceAlert(' + name + ',false,' + JSON.stringify(value).replace(/\"/g, "'") +')">取消</span>';

    /*模式 1代表提示框*/
    switch (mode){
        case 1:
            document.getElementById('iceAlertYes').style.pointerEvents = 'none';
            document.getElementById('iceAlertYes').innerHTML = '';
            if (name === null || name === undefined || name === ''){
                /*写入变更*/
                document.getElementById('iceAlertNo').innerHTML = '<span onclick="choseIceAlert(function (){},false,' + JSON.stringify(value).replace(/\"/g, "'") +')">取消</span>';
            }
            break;
        default:
            break;
    }
}

/*关闭*/
function choseIceAlert(name,result,value){
    iceConfirmUtils.animationClear();
    /*合并*/
    let receive = {result,data:value}
    if (name !== undefined)
        name(receive);
}

const iceConfirmUtils = {
    animationRun(){
        /*动画*/
        document.getElementById('iceAlertPanel').style.display = 'block';
        document.getElementById('iceAlertPanel').style.opacity = '1';
        document.getElementById('iceAlertPanel').style.pointerEvents = 'auto';
        document.getElementById('iceAlertTextPanelOutLine').style.animation = 'iceAlertTextPanelOutLineMove 1.5s linear';
        document.getElementById('iceAlertSquare').style.animation = 'iceAlertSquareLineMove 1.7s ease-out';
        document.getElementById('iceSmallSquare').style.animation = 'iceSmallSquareMove 1.5s cubic-bezier(.16,.39,.57,.98),iceSmallSquareRotate 1.5s linear';
        document.getElementById('iceLargeSquare').style.animation = 'iceLargeSquareMove 1.5s cubic-bezier(.16,.39,.57,.98),iceLargeSquareRotate 1.5s linear';
        document.getElementById('iceAlertTitle').style.animation = 'iceLargeSquareTextShow 2s linear';
        /*粒子*/
        let particleSquareInterval = setInterval(()=>{
            let particleSquare = document.createElement('span');
            particleSquare.className = 'particleSquare'
            particleSquare.style.left = (document.getElementById('iceLargeSquare').offsetLeft - 20 + Math.random() * 120).toString() + 'px';
            particleSquare.style.top = (document.getElementById('iceLargeSquare').offsetTop + 90).toString() + 'px';
            document.getElementById('iceAlertTextPanel').append(particleSquare);
            setInterval(()=>{
                particleSquare.remove();
            },1000)
        },80)
        /*取消粒子*/
        setTimeout(()=>{
            clearInterval(particleSquareInterval);
        },600)
    },
    animationSkip(){
        /*动画*/
        document.getElementById('iceAlertPanel').style.display = 'block';
        document.getElementById('iceAlertPanel').style.opacity = '1';
        document.getElementById('iceAlertPanel').style.pointerEvents = 'auto';
        onclickIceSmallSquare(true)();
        document.getElementById('iceSmallSquare').style.transform = 'rotate(45deg)'
    },
    animationClear(){
        /*取消动画*/
        document.getElementById('iceAlertPanel').style.display = 'none';
        document.getElementById('iceAlertPanel').style.opacity = '0';
        document.getElementById('iceAlertPanel').style.pointerEvents = 'none';
        document.getElementById('iceAlertTextPanelOutLine').style.animation = '';
        document.getElementById('iceAlertSquare').style.animation = '';
        document.getElementById('iceSmallSquare').style.animation = '';
        document.getElementById('iceLargeSquare').style.animation = '';
        document.getElementById('iceAlertTitle').style.animation = '';
    }
}

//模式切换
function onclickIceSmallSquare(reset){
    //旋转次数
    let iceSmallSquareRotateTurn;
    let init = false;
    return ()=>{
        if (!this.init){
            this.init = true;
            if (localStorage.getItem("SKIP_ICE_ANIMATION") === "true")
                this.iceSmallSquareRotateTurn = 1;
            else
                this.iceSmallSquareRotateTurn = 0;
        }
        if (reset){
            this.iceSmallSquareRotateTurn = 1;
            return true;
        }
        this.iceSmallSquareRotateTurn ++;
        document.getElementById('iceSmallSquare').style.transform = 'rotate(' + this.iceSmallSquareRotateTurn * 45 + 'deg)';
        if (localStorage.getItem("SKIP_ICE_ANIMATION") === "true")
            localStorage.setItem("SKIP_ICE_ANIMATION","false")
        else
            localStorage.setItem("SKIP_ICE_ANIMATION","true")
    }
}

/*初始化*/
function initIceConfirm(){
    if (isIceConfirmInit)
        return true;
    isIceConfirmInit = true;
    let iceAlertPanel = document.createElement('div')
    iceAlertPanel.className = 'iceAlertPanel'
    iceAlertPanel.id = 'iceAlertPanel'
    iceAlertPanel.innerHTML = `
        <div class="iceAlertCover"></div>
        <div class="iceAlertTextPanel" id="iceAlertTextPanel">
            <span class="iceLargeSquare" id="iceLargeSquare">
                <span class="iceAlertTitle" id="iceAlertTitle">
                    确认
                </span>
            </span>
            <span class="iceAlertSquare" id="iceAlertSquare">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </span>
            <div class="iceAlertTextPanelOutLine" id="iceAlertTextPanelOutLine">
                <span class="iceAlertText" id="iceAlertText">确定要取消喵？</span>
                <span class="iceAlertYes" id="iceAlertYes"><span>确认</span></span>
                <span class="iceAlertNo" id="iceAlertNo"><span>取消</span></span>
            </div>
            <span class="iceSmallSquare" id="iceSmallSquare" onclick="onclickIceSmallSquare()()"></span>
        </div>`
    document.body.append(iceAlertPanel);
}