
export function setStartTime(e) {
    let event = e.target.parentElement.parentElement;
    let startY = e.clientY;
    if (e.changedTouches) {
            const [touch] = e.changedTouches;
            startY = touch.pageY;
        }
    let startTop = parseInt(event.style.marginTop, 10);
    
    function doDrag(e) {
        let clientY = e.clientY;
         if (e.changedTouches) {
            document.body.style.overflowY = 'hidden';
            const [touch] = e.changedTouches;
            clientY = touch.pageY;
        }
        event.style.marginTop = (startTop + clientY - startY) + 'px';
    }

    function stopDrag(e) {
        document.body.style.overflowY = 'auto';
        document.documentElement.removeEventListener('mousemove', doDrag, false);
        document.documentElement.removeEventListener('touchmove', doDrag, false);
        document.documentElement.removeEventListener('mouseup', stopDrag, false);
        document.documentElement.removeEventListener('touchend', stopDrag, false);
        
    }
   
    document.documentElement.addEventListener('mousemove', doDrag, false);
    document.documentElement.addEventListener('touchmove', doDrag, false);

    document.documentElement.addEventListener('mouseup', stopDrag, false);
    document.documentElement.addEventListener('touchend', stopDrag, false);
    e.preventDefault();
    e.stopPropagation();
}


export function setEndTime(e) {
    let event = e.target.parentElement.parentElement;
    let startY = e.clientY;
    if (e.changedTouches) {
            const [touch] = e.changedTouches;
            startY = touch.pageY;
        }
    let startBottom = parseInt(event.style.marginBottom, 10);
    
    function doDrag(e) {
        let clientY = e.clientY;
         if (e.changedTouches) {
            document.body.style.overflowY = 'hidden';
            const [touch] = e.changedTouches;
            clientY = touch.pageY;
        }
        event.style.marginBottom = (startBottom - (clientY - startY)) + 'px';
    }

    function stopDrag(e) {
        document.body.style.overflowY = 'auto';
        document.documentElement.removeEventListener('mousemove', doDrag, false);
        document.documentElement.removeEventListener('touchmove', doDrag, false);
        document.documentElement.removeEventListener('mouseup', stopDrag, false);
        document.documentElement.removeEventListener('touchend', stopDrag, false);
        
    }
   
    document.documentElement.addEventListener('mousemove', doDrag, false);
    document.documentElement.addEventListener('touchmove', doDrag, false);

    document.documentElement.addEventListener('mouseup', stopDrag, false);
    document.documentElement.addEventListener('touchend', stopDrag, false);
    e.preventDefault();
    e.stopPropagation();
}
