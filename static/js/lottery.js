"use strict";

var Promise = Promise || ES6Promise.Promise; // do this to access Promise directly

// Running Chrome 42 or later
// because using fetch api
window.onload = function() {

	var if_null_or_empty = function (obj) {
		return (obj === null || obj === "");
	}
	var getText = function () {
		return document.getElementById('members').value;
	};
	var create_text = function(input_text) {
		var result = [];
		var arr = input_text.split(/\r\n|\r|\n/);
		for (var i = 0; i < arr.length; i++) {
			if(!if_null_or_empty(arr[i])) {
				result.push(arr[i]);
			}
		}
		return result;
	}
	var _create_element = function (id_name, data) {
		var result=document.getElementById(id_name);
		for (var i = 0, l= data.results.length; i < l;i++) { 
			var liNode = document.createElement('li');
			var textNode = document.createTextNode(data.results[i]);
			liNode.appendChild(textNode);
			result.appendChild(liNode);
		}
	}
	var _delete_element = function( id_name ){
	    var dom_obj=document.getElementById(id_name);
	    var dom_obj_firstchild=dom_obj.firstChild;
	    while (dom_obj_firstchild.nextSibling){
	        dom_obj.removeChild(dom_obj_firstchild.nextSibling);
	    }
	    dom_obj.removeChild(dom_obj_firstchild);
	}
	
	var show_element = function(id_name ,data) {
		_delete_element(id_name);
		_create_element(id_name, data);
	}

	var run = function() {
		var a = create_text(getText());
		if (a.length > 0){
			var formData={"members": a};
			var url = 'http://localhost:8000/'; 
			var processStatus = function (response) {
			    if (response.status === 200 || response.status === 0) {
			        return Promise.resolve(response)
			    } else {
			        return Promise.reject(new Error(response.statusText))
			    }
			};
			var parseJson = function (response) {
				var resp = response.json();
			    return resp;
			};
			// fetch API
			fetch(url, {
		        method: 'POST',
		        headers: {
		            Accept: 'application/json',
		        },
		        body: JSON.stringify(formData)
			    })
		        .then(processStatus)
		        .then(parseJson)
		        .then(function (data) {
					show_element("result", data);
		        });
		}
	}
	var btn = document.getElementById("btn");
	btn.addEventListener("click", run, false);

};