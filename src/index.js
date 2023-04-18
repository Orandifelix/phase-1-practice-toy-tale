let addToy = false;
const toyCollection = document.getElementById("toy-collection");
const addBtn = document.querySelector("#new-toy-btn");
const toyFormContainer = document.querySelector(".container");

function fetchToys() {
  return fetch("http://localhost:3000/toys")
    .then(response => response.json())
}


function createToy(toy_info) {
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      "name": toy_info.name.value,
      "image": toy_info.image.value,
      "likes": 0
    })
  })
  .then(response => response.json())
  .then((toy_object) => {
    let new_toy = renderToys(toy_object);
    toyCollection.append(new_toy);
  })
}

function likes(event) {
  event.preventDefault()
  let more = parseInt(event.target.previousElementSibling.innerText) + 1

  fetch(`http://localhost:3000/toys/${event.target.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"

      },
      body: JSON.stringify({
        "likes": more
      })
    })
    .then(res => res.json())
    .then((like_obj => {
      event.target.previousElementSibling.innerText = `${more} likes`;
    }))
}

function renderToys (toy) {
  const h2 = document.createElement("h2");
  h2.innerText = toy.name;

  const img = document.createElement("img");
  img.className = "toy-avatar";
  img.src = toy.image;

  const p = document.createElement("p");
  p.innerText = `${toy.likes} likes`

  const button = document.createElement("button");
  button.className = "like-btn";
  button.id = toy.id;
  button.innerText = "Like";
  button.addEventListener("click", event => {
    console.log(event.target.dataset);
    likes(event);
  })

  const divCard = document.createElement("div");
  divCard.className = "card";
  divCard.append(h2, img,p, button );
  toyCollection.appendChild(divCard);
}

// Add listener to 'Add Toy' button to show or hide form
addBtn.addEventListener("click", () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyFormContainer.style.display = "block"
    toyFormContainer.addEventListener("submit", event => {
      event.preventDefault();
      createToy(event.target)
    })
  } else {
    toyFormContainer.style.display = "none"
  }
})

 
fetchToys().then(toys => {
  toys.forEach(toy => {
    renderToys(toy)
  })
})