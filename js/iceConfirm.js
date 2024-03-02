
let isIceConfirmInit = false;

/*title(2)，text(<=15),-1 default*/
function openIceConfirm(title,text){
    initIceConfirm();
    let iceConfirm = new Promise((resolve,reject) => {
        if (localStorage.getItem("SKIP_ICE_ANIMATION") === "true")
            iceConfirmUtils.animationSkip();
        else
            iceConfirmUtils.animationRun();

        if (title && title.length === 2)
            document.getElementById('iceAlertTitle').innerText = title;
        if (text && text.length <= 15 && text !== -1)
            document.getElementById('iceAlertText').innerText = text;

        document.getElementById('iceAlertYes').style.pointerEvents = 'auto';
        document.getElementById('iceAlertYes').innerHTML = '<span>yes</span>';
        document.getElementById('iceAlertNo').innerHTML = '<span>no</span>';

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

/*old method、value（obj）、title、text、mode（1：tips）*/
/*title,-1-default*/
/*result-receive.result、value-receive.data*/
function openIceAlert(name,value,title,text,mode){
    initIceConfirm();
    if (value === undefined)
        value = {}
    if (value.constructor !== Object && text === undefined && mode === undefined){
        text = title;
        title = value;
    }else if (value.constructor !== Object && mode === undefined){
        mode = text;
        text = title;
        title = value;
    }

    if (title && title.length === 2)
        document.getElementById('iceAlertTitle').innerText = title;
    if (text && text.length <= 15 && text !== -1)
        document.getElementById('iceAlertText').innerText = text;

    if (localStorage.getItem("SKIP_ICE_ANIMATION") === "true")
        iceConfirmUtils.animationSkip();
    else
        iceConfirmUtils.animationRun();

    document.getElementById('iceAlertYes').style.pointerEvents = 'auto';
    document.getElementById('iceAlertYes').innerHTML = '<span onclick="choseIceAlert(' + name + ',true,' + JSON.stringify(value).replace(/\"/g, "'") +')">yes</span>';
    document.getElementById('iceAlertNo').innerHTML = '<span onclick="choseIceAlert(' + name + ',false,' + JSON.stringify(value).replace(/\"/g, "'") +')">no</span>';

    switch (mode){
        case 1:
            document.getElementById('iceAlertYes').style.pointerEvents = 'none';
            document.getElementById('iceAlertYes').innerHTML = '';
            if (name === null || name === undefined || name === ''){
                document.getElementById('iceAlertNo').innerHTML = '<span onclick="choseIceAlert(function (){},false,' + JSON.stringify(value).replace(/\"/g, "'") +')">no</span>';
            }
            break;
        default:
            break;
    }
}

function choseIceAlert(name,result,value){
    iceConfirmUtils.animationClear();
    let receive = {result,data:value}
    if (name !== undefined)
        name(receive);
}

const iceConfirmUtils = {
    animationRun(){
        document.getElementById('iceAlertPanel').style.display = 'block';
        document.getElementById('iceAlertPanel').style.opacity = '1';
        document.getElementById('iceAlertPanel').style.pointerEvents = 'auto';
        document.getElementById('iceAlertTextPanelOutLine').style.animation = 'iceAlertTextPanelOutLineMove 1.5s linear';
        document.getElementById('iceAlertSquare').style.animation = 'iceAlertSquareLineMove 1.7s ease-out';
        document.getElementById('iceSmallSquare').style.animation = 'iceSmallSquareMove 1.5s cubic-bezier(.16,.39,.57,.98),iceSmallSquareRotate 1.5s linear';
        document.getElementById('iceLargeSquare').style.animation = 'iceLargeSquareMove 1.5s cubic-bezier(.16,.39,.57,.98),iceLargeSquareRotate 1.5s linear';
        document.getElementById('iceAlertTitle').style.animation = 'iceLargeSquareTextShow 2s linear';
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
        setTimeout(()=>{
            clearInterval(particleSquareInterval);
        },600)
    },
    animationSkip(){
        document.getElementById('iceAlertPanel').style.display = 'block';
        document.getElementById('iceAlertPanel').style.opacity = '1';
        document.getElementById('iceAlertPanel').style.pointerEvents = 'auto';
        onclickIceSmallSquare(true)();
        document.getElementById('iceSmallSquare').style.transform = 'rotate(45deg)'
    },
    animationClear(){
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

function onclickIceSmallSquare(reset){
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
                    yes
                </span>
            </span>
            <span class="iceAlertSquare" id="iceAlertSquare">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </span>
            <div class="iceAlertTextPanelOutLine" id="iceAlertTextPanelOutLine">
                <span class="iceAlertText" id="iceAlertText">title</span>
                <span class="iceAlertYes" id="iceAlertYes"><span>yes</span></span>
                <span class="iceAlertNo" id="iceAlertNo"><span>no</span></span>
            </div>
            <span class="iceSmallSquare" id="iceSmallSquare" onclick="onclickIceSmallSquare()()"></span>
        </div>`
    document.body.append(iceAlertPanel);
}
