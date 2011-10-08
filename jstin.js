/* 
 * 
 * We are not allowed to use other js libraries, so I will write my own.
 * I'll call it jstin after my name.
 * Author:  Justin Martin
 * Date: September 22, 2011
 * jstin: a js library to make common js things a lot easier
 */

/*
                     I8                       
                     I8                       
     gg           88888888  gg                
     ""              I8     ""                
     gg    ,g,       I8     gg    ,ggg,,ggg,  
     8I   ,8'8,      I8     88   ,8" "8P" "8, 
    ,8I  ,8'  Yb    ,I8,    88   I8   8I   8I 
  _,d8I ,8'_   8)  ,d88b, _,88,_,dP   8I   Yb,
888P"888P' "YY8P8P88P""Y888P""Y88P'   8I   `Y8
   ,d8I'                                      
 ,dP'8I                                       
,8"  8I                                       
I8   8I                                       
`8, ,8I                                       
 `Y8P"
 
 */

/*
 * elementSelector - a string
 * to select via class, use '.'
 * to select via id, use '#'
 * to select via tag, don't use anything.
 * Or you can pass in an element.
 */

function _(elementSelector) {
	var el;
	if(typeof elementSelector == "string") {
		if(elementSelector.charAt(0) == '.') {
			el = document.getElementsByClassName(elementSelector.substring(1,elementSelector.length));
		} else if(elementSelector.charAt(0) == '#') {
			el = document.getElementById(elementSelector.substring(1,elementSelector.length));
		} else if(elementSelector.charAt(0) != '.' || elementSelector.charAt(0) != '#') {
			el = document.getElementsByTagName(elementSelector);
		} 
	} else {
		el = elementSelector;
	}
	
	var element = new Element(el);
	return element;
}

/*
 * Some global variables needed for drag and drop
 */

var _draggingHasStarted = false;
var _draggingElement = null;
var _draggingElementOffsetX = 0;
var _draggingElementOffsetY = 0;
var _draggingOrigPosition = {x:0,y:0};
var _draggingElementOrigStyle = null;
var _draggingUserOffsetX = 0;
var _draggingUserOffsetY = 0;


function Element(element) {
    this.element = element;
    this.type = "Element";
	    
    this.addText = function(text) {
        this.forEveryElement(this);
        var textNode = document.createTextNode(text);
        this.element.appendChild(textNode);
        return this;
    };
    
    /*
     * appendElement - Apppend a new element
     * elementTagName - the name of the tag of the element, or the element itself
     */
    
    this.appendElement = function(elementTagName) {
        this.forEveryElement(this);
        var el;
        if(typeof elementTagName == "string") {
        	 el = document.createElement(elementTagName);
    	} else {
    		el = elementTagName;
    	}
        this.element.appendChild(el);
        return new Element(el);
    };
    
    this.getDomElement = function() {
    	return this.element;
    }
    
    this.addClass = function(className) {
    	this.forEveryElement(this);
    	var attr = this.element.getAttribute("class");
    	if(attr != "" || attr != null){
    		attr += " " + className;
    	} else {
    		attr = className;
    	}
    	this.element.setAttribute("class",attr);
    	return this;
    }
    
    this.addStyle = function(style) {
    	this.forEveryElement(this);
    	var curStyle = this.element.getAttribute("style");
    	if(curStyle != null) {
    		style += curStyle;	
    	}
    	this.element.setAttribute("style",style);
    	return this;
    }
    
    this.setAttribute = function(attribute, value) {
    	this.forEveryElement(this);
    	this.element.setAttribute(attribute,value);
    	return this;
    }
    
    this.removeAttribute = function(attribute) {
    	this.forEveryElement(this.removeAttribute);
    	this.element.removeAttribute(attribute);
    	return this;
    }
    
    this.getValue = function() {
    	this.forEveryElement(this);
    	return this.element.value;
    }
    
    this.onDoubleClick = function(functionVar) {
    	this.forEveryElement(this);
    	this.element.ondblclick = functionVar;
    	return this;
    }
    
    this.onClick = function(functionVar) {
    	this.forEveryElement(this);
    	this.element.onclick = functionVar;
    	return this;
    }
    
    this.onChange = function(functionVar) {
    	this.forEveryElement(this);
    	this.element.onchange = functionVar;
    	return this;
    }
    
    this.onKeyPress = function(functionVar) {
    	this.forEveryElement(this);
    	this.element.onkeypress = functionVar;
    	return this;
    }
    
    this.onAny = function(functionVar) {
    	this.forEveryElement(this);
    	this.element.onkeypress = functionVar;
    	this.element.onchange = functionVar;
    	this.element.onclick = functionVar;
    	this.element.ondblclick = functionVar;
    	this.element.onblur = functionVar;
    	this.element.onfocus = functionVar;
    	return this;
    }
    
    this.onMouseMove = function(functionVar) {
    	this.forEveryElement(this);
    	this.element.onmousemove = functionVar;
    	return this;
    }
    
    this.onMouseDown = function(functionVar) {
    	this.forEveryElement(this);
    	this.element.onmousedown = functionVar;
    	return this;
    }
    
    this.onMouseUp = function(functionVar) {
    	this.forEveryElement(this);
    	this.element.onmouseup = functionVar;
    	return this;
    }
    
    this.moveToRelative = function(x,y) {
    	this.element.style.position = "relative";
    	this.element.style.top = y + "px";
    	this.element.style.left = x + "px";
    }
    
    this.moveTo = function(x,y) {
    	this.element.style.position = "absolute";
    	this.element.style.top = y + "px";
    	this.element.style.left = x + "px";
    }
    
    this.getPosition = function() {
    	var box = this.element.getBoundingClientRect();
    	var offsets = getScrollOffsets();
	   	var x = box.left + offsets.x;
    	var y = box.top + offsets.y;
    	return {"x":x, "y":y};
    }
    
    getMousePosition = function(e) {
    	var offsets = getScrollOffsets();
		var x = e.clientX + offsets.x;
		var y = e.clientY + offsets.y;
    	return {"x":x, "y":y};
    }
    
    function getScrollOffsets() {
		w = window;
		if (w.pageXOffset != null)
		return {x: w.pageXOffset, y:w.pageYOffset};
	}
	
	function getCurrentTime() {
		return (new Date()).getTime();
	}
	
	this.makeDraggable = function() {
		return this.makeDraggableWithOffset(0,0);
	}

    this.makeDraggableWithOffset = function(userOffsetX,userOffsetY) {
    	
    	this.forEveryElement(this);
    	
    	this.onMouseDown(function(e) {
    		if(!_draggingHasStarted) {
    			_draggingUserOffsetX = userOffsetX;
	    		_draggingUserOffsetY = userOffsetY;
	    		_draggingElement = _(e.currentTarget).clone().getDomElement();
	    		_(e.currentTarget.parentNode).appendElement(_draggingElement);
	    		_draggingElementOrigStyle = _draggingElement.getAttribute("style"); 
	    		e.preventDefault();
	    		_draggingHasStarted = true;
	    		var pos = _(e.currentTarget).getPosition();
	    		var mouse = getMousePosition(e);
	    		_draggingElementOffsetX = mouse.x - pos.x;
	    		_draggingElementOffsetY = mouse.y - pos.y;
	    		_draggingElement.style.opacity = 0.7;
	    		_draggingOrigPosition.x = pos.x + _draggingUserOffsetX;
	    		_draggingOrigPosition.y = pos.y + _draggingUserOffsetY;
	    		_(_draggingElement).moveTo(_draggingOrigPosition.x,_draggingOrigPosition.y);
	    	}
    	});
    	
    	_(document).onMouseUp(function(e) {
    		if(_draggingHasStarted) {	    		
	   			var endFunction = function() {
			    	// restore old style
			    	_draggingElement.setAttribute("style",_draggingElementOrigStyle);
			   		_(_draggingElement).remove();
			   		_draggingHasStarted = false;
			    }
	    		// slide back to the original position
	    		_(_draggingElement).slideToWithOffset(_draggingOrigPosition.x,_draggingOrigPosition.y,_draggingUserOffsetX,_draggingUserOffsetY,endFunction);
	    	}
    	});
    	
    	_(document).onMouseMove(function(e) {
    		e.preventDefault();
    		if(_draggingHasStarted) {
    			var pos = _(_draggingElement).getPosition();
    			var mouse = getMousePosition(e);
	    		var x = mouse.x - _draggingElementOffsetX + _draggingUserOffsetX;
	    		var y = mouse.y - _draggingElementOffsetY + _draggingUserOffsetY;
	    		
	    		_(_draggingElement).moveTo(x,y);
	    	}
    	});
    	return this;
    }
    
    this.slideTo = function(x,y,endFunction) {
    	return this.slideToWithOffset(x,y,0,0,endFunction);
    }
    
    this.slideToWithOffset = function(x,y,offsetX,offsetY,endFunction) {
    	var originalStyle = this.element.style.cssText;
    	
    	var endX = x;
    	var endY = y;
    	var pos = this.getPosition();
    	var startX = pos.x + offsetX;
    	var startY = pos.y + offsetY; 
	    var distX = x - pos.x - offsetX;
    	var distY = y - pos.y - offsetY;
    	var totalDistance = Math.sqrt((distX*distX) + (distY*distY));
	    var count = 0;
	    var done = false;
	    var rate = 1;
	    
	    animate(this.element);
	    function animate(element) {	    	
	    	if(rate < 15 )
	    		rate += .1;
	    	count += rate;
	    	var curPos = _(element).getPosition();
	    	var curDistX =  endX - curPos.x;
			var curDistY = endY - curPos.y;
			var curDistance = Math.sqrt((curDistX*curDistX) + (curDistY*curDistY));
			var percentDone = count/totalDistance;
			var moveToX = Math.round((percentDone*distX) + startX);
			var moveToY = Math.round((percentDone*distY) + startY);
			_(element).moveTo(moveToX,moveToY);
			if(percentDone <= 1) {
	    		setTimeout(function(){animate(element);},1);
		   } else {
		   		endFunction();
		   }
		}
		return this;
    }
    
    this.clone = function() {
    	var newNode = this.element.cloneNode(true);
    	return _(newNode);
    }
    
    this.remove = function() {
    	this.element.parentNode.removeChild(this.element);
    }
    
    /*
     * forEveryElement
     * If your selector selects an array
     * We can do the method performed on every element in the set.
     * This works in most cases.  But I still need to work out some bugs.
     */
    
    this.forEveryElement = function(functionVar) {
	    if(typeof this.element[0] != null) {
	    	var elementArray = this.element;
	    	for(var i = 0; i < elementArray.length; i++) {
	    		this.element = elementArray[i];
	    		functionVar;
	    	}
    	}	
    }
}
