import { Question } from "./question";
import { authWithEmailAndPassword, getAuthForm } from "./auth";
import { createModal, isValid } from "./utilus";
import "./style.css";

const form = document.getElementById("form");
const modalBtn = document.getElementById("modal-btn");
const input = form.querySelector("#question-input");
const submitBtn = form.querySelector("#submit");

window.addEventListener("load", Question.renderList);
form.addEventListener("submit", submitFormHandler);
modalBtn.addEventListener("click", openModal);
input.addEventListener("input", () => {
	submitBtn.disabled = !isValid(input.value);
});

function submitFormHandler(event) {
	event.preventDefault();
	console.log(input.value);
	if (isValid(input.value)) {
		const question = {
			text: input.value.trim(),
			date: new Date().toJSON(),
		};

		submitBtn.disabled = true;
		// Async request to server to save question
		Question.create(question).then(() => {
			input.value = "";
			input.className = "";
			submitBtn.disabled = false;
		});
	}
}

function openModal() {
	createModal("Sign in the room", getAuthForm());
	document
		.getElementById("auth-form")
		.addEventListener("submit", authFormHandler, { once: true });
}

function authFormHandler(event) {
	event.preventDefault();

	const btn = event.target.querySelector("button");
	const email = event.target.querySelector("#email").value;
	const password = event.target.querySelector("#password").value;

	btn.disabled = true;

	authWithEmailAndPassword(email, password)
		.then(Question.fetch)
		.then(renderModalAfterAuth)
		.then(() => (btn.disabled = false));
}


function renderModalAfterAuth(content){
	if(typeof content === 'string'){
		createModal('Ошибка!', content)
	}else {
		createModal('Question list', Question.listToHtml(content))
	}
}