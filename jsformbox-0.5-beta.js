  /**************************************************************************
   *  Copyright © 2014 @abnlabs http://cproscodedev.com.ng                  *
   *  All Rights Reserved                                                   *
   *                                                                        *
   *  @package Library                                                      *
   *  @license MIT                                                          *
   *  @author  Ifeora Okechukwu                                             *
   *  @description                                                          *
   * ---------------------------------------------------------------------- *
   * File Name: JSformbox.js (for HTML5)                                    *
   * Version: 0.5 (beta)                                                   *
   * Date Created: 03/03/2013                                               *
   * Date Last Modified: 04/10/2013                                         *
   *                                                                        *
   * Redistribution and use in source and binary forms, with or without     *
   * modification are permitted under open source licensing terms without   *
   * the transfer of rights                                                 *        
   *------------------------------------------------------------------------*
   * THIS LIBRARY IS PROVIDED BY THE COPYRIGHT HOLDERS AND AUTHORS ON AN    *
   * "AS IS" BASIS HENCE ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING,      *
   * BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND      * 
   * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE *
   * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,    *
   * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES               *
   *------------------------------------------------------------------------*
   *                                                                        *
   *                                                                        *
   * @see http://cproscodedev.com.ng/projects/JSformbox/                    *
   * @see http://ejohn.org/packages/javascript-events                       *
   * @see http://scottanderews.com                                          *
   * @see http://mattkruse.com                                              *
   * @depends JSutility v1.0+  - http://github.com/isocroft/JSutitlity      *
   *                                                                        *    
   * This script will enable all client browsers to process HTML5 form      *
   * element types as if they had native implementation for these types.    * 
   *                                                                        * 
   * It will also include custom deep styling of HTML5 form elements        *
   *                                                                        *
   * Finally, it will also apply HTML5 form validation for required fields  *
   *                                                                        *
   * The HTML5 form types affected are as follows...                        *
   *                                                                        *
   * input[type="text"],                                                    *
   * input[type="password"],                                                *
   * input[type="datetime"],                                                *
   * input[type="datetime-local"],                                          *
   * input[type="date"],                                                    *
   * input[type="month"],                                                   *
   * input[type="time"],                                                    *
   * input[type="week"],                                                    *
   * input[type="number"],                                                  *
   * input[type="email"],                                                   *
   * input[type="search"],                                                  *
   * input[type="tel"],                                                     *
   * input[type="color"]                                                    *
   **************************************************************************/
 
 'use strict';
 
 /*! TODO:
     1. include Password Meter
	 2. include Textarea Counter
  */

  
(function(){

// CHECK FOR NAMESPACE CONFLICTS
var FormBox = {};
window['FormBox'] = window['FormBox'] || FormBox ;

function DateFormat(format){
  this.format = (format)? format : {days:0,mnths:0,yrs:0};
  
  // Static vars
  DateFormat.DAYS = this.format.days;
  DateFormat.MONTHS = this.format.mnths;
  DateFormat.YEARS = this.format.yrs;
  
} 	 

var EmailRegex = /(^([\w\.\-]+)\@(([\w\-])+\.)+(?:com|co.uk|za|net|biz|tv|bbr)$)/;
var MobPhoneNumRegex = new RegExp("(^\\+234(?:70|80|81|71)([\\d]+)$)");
var DateRegex = new RegExp("(^(\\d{1,"+DateFormat.DAYS+"})\\/(\\d{1,"+DateFormat.MONTHS+"})\\/(\\d{1,"+DateFormat.YEARS+"})$)");
var TimeRegex = null;
var ColorRegex = null;

function start(){
	
function LTrim(str){if(str==null){return null;}for(var i=0;str.charAt(i)==" ";i++);return str.substring(i,str.length);}
function RTrim(str){if(str==null){return null;}for(var i=str.length-1;str.charAt(i)==" ";i--);return str.substring(0,i+1);}
function Trim(str){return LTrim(RTrim(str));}
function LTrimAll(str){if(str==null){return str;}for(var i=0;str.charAt(i)==" " || str.charAt(i)=="\n" || str.charAt(i)=="\t";i++);return str.substring(i,str.length);}
function RTrimAll(str){if(str==null){return str;}for(var i=str.length-1;str.charAt(i)==" " || str.charAt(i)=="\n" || str.charAt(i)=="\t";i--);return str.substring(0,i+1);}
function TrimAll(str){return LTrimAll(RTrimAll(str));}
function isNull(val){return(val==null);}
function isBlank(val){if(val==null){return true;}for(var i=0;i<val.length;i++){if((val.charAt(i)!=' ')&&(val.charAt(i)!="\t")&&(val.charAt(i)!="\n")&&(val.charAt(i)!="\r")){return false;}}return true;}
function isInteger(val){if(isBlank(val)){return false;}for(var i=0;i<val.length;i++){if(!isDigit(val.charAt(i))){return false;}}return true;}
function isNumeric(val){return(parseFloat(val,10)==(val*1));}
function isArray(obj){return(typeof(obj.length)=="undefined")?false:true;}
function isDigit(num){if(num.length>1){return false;}var string="1234567890";if(string.indexOf(num)!=-1){return true;}return false;}
function setNullIfBlank(obj){if(isBlank(obj.value)){obj.value="";}}
function setFieldsToUpperCase(){for(var i=0;i<arguments.length;i++){arguments[i].value = arguments[i].value.toUpperCase();}}
function disallowBlank(obj){var msg=(arguments.length>1)?arguments[1]:"";var dofocus=(arguments.length>2)?arguments[2]:false;if(isBlank(getInputValue(obj))){if(!isBlank(msg)){alert(msg);}if(dofocus){if(isArray(obj) &&(typeof(obj.type)=="undefined")){obj=obj[0];}if(obj.type=="text"||obj.type=="textarea"||obj.type=="password"){obj.select();}obj.focus();}return true;}return false;}
function disallowModify(obj){var msg=(arguments.length>1)?arguments[1]:"";var dofocus=(arguments.length>2)?arguments[2]:false;if(getInputValue(obj)!=getInputDefaultValue(obj)){if(!isBlank(msg)){alert(msg);}if(dofocus){if(isArray(obj) &&(typeof(obj.type)=="undefined")){obj=obj[0];}if(obj.type=="text"||obj.type=="textarea"||obj.type=="password"){obj.select();}obj.focus();}setInputValue(obj,getInputDefaultValue(obj));return true;}return false;}

	
FormBox.init = function(configbase){
var formObj = null, allReq = !!configbase.allrequired, chldMx = configbase.childMax, eventMtds = []; // Note: [eventMtds] array will be associative!! 

if(configbase.name && typeof(configbase.name) == 'string'){
           formObj = document.forms[configbase.name] || document[configbase.name];
	       if(formObj && formObj.tagName != 'FORM'){
	                 throw new TypeError('TypeError: Cannot initialise non-form object');
	       }

           if(formObj == null){
		       formObj = document.createElement('form');
			   formObj.setAttribute('name',configbase.name);
			   formObj.setAttribute('data-all-required', configbase.allrequired);
			   
			   
		   } 		   
 
}else if(configbase.id && typeof(configbase.id) == 'string'){
            formObj = document.getElementById(configbase.id);
			   
			if(formObj == null){
			   formObj = document.createElement('form');
			   formObj.id = configbase.id;
			   formObj.setAttribute('data-all-required', configbase.allrequired);
			}               			
}
    
eventMtds['onsubmit'] = (typeof(configbase.onSubmit) == 'function')? configbase.onsubmit : function(){};
eventMtds['onresize'] = (typeof(configbase.onResize) == 'function')? configbase.onresize : function(){};
eventMtds['onkeypress'] = (typeof(configbase.onKeypress) == 'function')? configbase.onkeypress : function(){};

   
           
// BEGIN CONSTRUCTOR DEFINITION		   
  function Form(form, events){
      
	  Form.isElement = function(obj){
	    var div = typeof(document) != "undefined" && document.createElement("div");
        return div && obj && obj.nodeType === 1;
      }
   
      this.child_max = (chldMx)? chldMx : 30;
      this.form = form;
      this.events = events;
	  this.dateFormat = new DateFormat();	
      return this;

Form.prototype.setParams = function(params){
  var input = document.createElement('input');
  input.type = "hidden";
  var name = value = null;
  for(var x in params){
        switch(x){
	        case "name":
	           name = params[x];
	        break;
	        case "value":
	           value = params[x];
	        break;
	        default:
	    }
  } 
  if(name != null && value != null){  
         input.setAttribute('name',name);
         input.setAttribute('value',value);
  }else{
	    throw new Error('Cannot set with missing parameters');
  }	 
    
	this.form.appendChild(input);
}


Form.prototype.installSkin = function(cssfile){
    if(cssfile instanceof String){ 
         importCSSFile(cssfile);
    }
}

Form.prototype.getForm(){
  return this.form;
}

};
// END CONSTRUCTOR DEFINITION



var formbox = new Form(formObj, eventMtds);

return {

   getAllFields: function(){
      return formbox.form.getElementsByTagName("input");
   },
   
   storeData:function(proc){ // [proc] should be an associative array
      // use this later... formbox.events['onsubmit']
	   for(var r in proc){
           formbox.setParams({name:r,value:proc[r]});
	   }
   },

   setFormAttr: function(prop, val){
       formbox.getForm().setAttribute(prop, val); 
   },
   
   setToDefaultValidate: function(elements){
   
   },
   
   addFiledAt: function(element, index){
      if(!Form.isElement(element)) return;
	  var len = formbox.getForm().elements.length;
      index = index || (len - 1);
	  var elem = formbox.getForm().elements[index];
	  formbox.getForm().insertAfter(element, elem);
   },
   
   removeFieldAt: function(index){
      var elem = formbox.getForm().elements[index];
      formbox.getForm().removeChild(elem);
   },
   
   setAllFieldsToUpper: function(/*varargs*/){
       setFieldsToUpperCase(getAllFields());
   }
 }
 
}

}

wondow.addEventListener('load', start, false);

}());

// IMPLEMENTATION SYNTAX
// var fObj = Formbox.formInit({id:"widget-x",onSubmit:function(){},childMax:7,allRequired:true,onKeypressed:function(){}});
// fObj.removeFieldAt(1);
