//first function that runs
const validate = () => {
	let form = document.myform;
	$('.error').hide();
	
	let error = false;
	if(!form.term.value){
		$('.error-term').show();
		error = true;
	}
	if(form.type.value === ''){
		$('.error-type').show();
		error = true;
	}
	
	//after validation, check if any errors were triggered. If no errrors, add the item to the appropriate list
	if(!error){
		const REQ = {
			term: form.term.value.toLowerCase(),
			type: form.type.value
		}
		addToList(REQ);
	}
}

const addToList = (R) => {
	//save HTML to var with correct values
	let pList = '<li class="attr-item">';
	pList += '<span data-value=\'{"term":"'+R.term+'","type":"'+R.type+'"}\'>'+R.term;
	pList += '<a>X</a>';
	pList += '</span>';
	
	//Do a check for which list to add the item to
	if(R.type > 0){
		$('.positive-box ul.nav').append(pList);
	}else{
		$('.negative-box ul.nav').append(pList);
	}
	
	//Let's sort the list now that it's added
	sortList(R.type);
}

const sortList = (type) => {
	//console.log('sorting'+type);
	let box = (type > 0) ? $('.positive-box ul.nav') : $('.negative-box ul.nav');
	
	box.children().sortDomElements(function(a, b){
		let aN = $(a).children('span').data('value').term;
		let bN = $(b).children('span').data('value').term;
		return (aN == bN) ? 0 : ((aN > bN) ? 1 : -1);
	})
	
	//Req was to clear the form after adding the item to the list
	resetForm();
}

//resets form with empty values
const resetForm = () => {
	document.myform.term.value = '';
	document.myform.type.value = '';
}


//jQuery events added here

//add click event to words here that populate form
$(document).on('click', '.attr-item span', function(){
	document.myform.term.value = $(this).data('value').term;
	document.myform.type.value = $(this).data('value').type;
})

//remove event that removes word from list
$(document).on('click', '.attr-item span a', function(e){
	$(this).parents('li').remove();
	//stopPropagation prevents parent event from firing
	e.stopPropagation();
})

//Cool jquery plugin to sort dom elements, grabbed here:
//http://stackoverflow.com/questions/282670/easiest-way-to-sort-dom-nodes
$.fn.sortDomElements = (function() {
    return function(comparator) {
        return Array.prototype.sort.call(this, comparator).each(function(i) {
              this.parentNode.appendChild(this);
        });
    };
})();