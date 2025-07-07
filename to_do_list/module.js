const color_present = document.querySelectorAll(".present");
const color_dropdown = document.querySelectorAll(".color-dropdown");
const color_picker_preview = document.querySelectorAll(".color-dropdown ul li .preview");
const color_picker = document.querySelectorAll(".color-dropdown ul li input");
let present_object = null;
const setting = document.getElementById('setting-background');

const To_Do_Bar = `
<div class="color-list">
	<button class="present"></button>
</div>
<input type="text" name="todo" placeholder="Write To-Do (Not Empty)" readonly/>
<div class="set" onmouseenter="etc_show(this)" onmouseleave="etc_hide(this)">
	<button class="preview show">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
			<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
		</svg>
	</button>
	<div class='etc hidden'>
		<button class='edit' onclick="Button_Edit(this)">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
			</svg>
		</button>
		<button class='check' onclick="Button_Check(this)">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
			</svg>
		</button>
	</div>
</div>
`;

/*
	<div class="button-list hidden">
		<button class="edit" onclick="Edit(this)"></button>
		<button class="delete" onclick="Delete(this)"></button>
	</div>
*/
color_picker.forEach((picker, index) => {
	picker.addEventListener('input', () => {
		color_present[index].style.background = picker.value;
	});
})

color_picker.forEach((picker, index) => {
	picker.addEventListener('click', () => {
		color_picker_close(picker);
	});
})

color_present.forEach((button, index) => {
	button.addEventListener('click', () => {
		color_dropdown[index].classList.toggle('show');
	});
});

function color_picker_close(item){
	const parent = item.closest(".color-list");
	const color_menu = parent.querySelector(".color-dropdown");
	color_menu.classList.toggle('show');
}

function color_pick(item){
	const color = getComputedStyle(item).background;
	const parent = item.closest(".color-list");
	parent.querySelector(".present").style.background = color;
	color_picker_close(item);
}

function Add_To_Do(item){
	const id = Create_ID();
	const todo = item.closest('.add-todo').querySelector('input[name="todo"]').value;
	const color = getComputedStyle(item.closest('.add-todo').querySelector('.present')).background;
	const due = null;
	const bar_data = {
		"todo": todo,
		"color": color,
		"due": due
	};
	console.log(id);
	console.log(todo);
	console.log(color);
	localStorage.setItem(id, JSON.stringify(bar_data));
	Render_Bar(id);
	requestAnimationFrame(() => {
		const p_list = document.getElementById('content').querySelectorAll('.todo');
		p_list[p_list.length - 1].classList.add('show');
	});
}
function Render_Bar(id){
	const bar = document.createElement('div');
	bar.classList.add('todo');
	bar.setAttribute('data-id', id);
	const element = JSON.parse(localStorage.getItem(id));
	bar.innerHTML = To_Do_Bar;
	bar.querySelector('input').value = element.todo;
	bar.querySelector('.color-list>.present').style.background = element.color;
	const parent = document.getElementById('content');
	parent.appendChild(bar);
}

function etc_show(item){
	item.querySelector('.preview').classList.remove('show');
	item.querySelector('.preview').classList.add('hidden');
	item.querySelector('.etc').classList.remove('hidden');
	item.querySelector('.etc').classList.add('show');
}

function etc_hide(item){
	item.querySelector('.preview').classList.remove('hidden');
	item.querySelector('.preview').classList.add('show');
	item.querySelector('.etc').classList.remove('show');
	item.querySelector('.etc').classList.add('hidden');
}

function Button_Edit(item){
	if(setting.classList.contains("show")){
		present_object = null;
	}
	else{
		present_object = item.closest(".todo");
		const element = JSON.parse(localStorage.getItem(present_object.dataset.id));
		setting.querySelector('#date').value = element.due;
		setting.querySelector('#todo').value = element.todo;
		setting.querySelector('.present').style.background = element.color;
	}
	setting.classList.toggle('show');
}

function Button_Check(item){
	
}

function Button_Delete(){
	if(!(present_object===null)){
		const present_id = present_object.dataset.id;
		localStorage.removeItem(present_id);
		setting.classList.toggle('show');
		present_object.classList.remove('show');
		present_object.addEventListener('transitionend', ()=> {
			present_object.remove();
		}, {once: true});
	}
}

function Button_Save(item){
	if(!(present_object === null)){
		const due = setting.querySelector('#date').value;
		const todo = setting.querySelector('#todo').value;
		const color =  getComputedStyle(setting.querySelector('.present')).background;	
		const bar_data = {
			"due": due,
			"todo": todo,
			"color": color
		};
		localStorage.setItem(present_object.dataset.id, JSON.stringify(bar_data));
		present_object.querySelector('input[name="todo"]').value = todo;
		present_object.querySelector('.present').style.background = color;
		present_object = null;
		setting.classList.toggle('show');
	}
}

function Create_ID(){
	return `${Date.now()}`;
}

window.onload = function(){
	const keys = Object.keys(localStorage);
	keys.sort();
	for(const key of keys) Render_Bar(key);
	requestAnimationFrame(() => {
		const p_list = document.getElementById('content').querySelectorAll('.todo');
		for(let i = 0; i < p_list.length; i++){
			p_list[i].classList.add('show');
		}
	});
}