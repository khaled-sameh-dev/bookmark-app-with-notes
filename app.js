document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const addNoteBtn = document.querySelector("#add-note");
  const noteInputsContainer = document.querySelector(".note-inputs-container");
  const bookmarkContainer = document.querySelector(".bookmarks-container");
  const addBookmarkBtn = document.querySelector("#add-bookmark");
  const bookmarkUrl = document.querySelector("#page-url");
  const bookmarkTitle = document.querySelector("#page-name");
  
  let savedBookmarks = [];
  
  addNoteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    noteInputsContainer.insertAdjacentHTML('beforeend', `
      <div class="note-container">
        <input class="input-note" type="text">
        <span class="cancel-input"><i class="fa-solid fa-xmark"></i></span>
      </div>
      `);
  });
  
  noteInputsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("cancel-input")) {
      e.target.parentElement.remove();
    }
  });
  
  addBookmarkBtn.addEventListener("click", (e) => {
    e.preventDefault();
    
    if (bookmarkTitle.value.trim() === "")
      return alert("Please enter the title of the URL");
    if (!checkUrl(bookmarkUrl.value)){
      form.reset();
      return alert("Please enter a valid URL , start with (http:// , https://)");
    }
    
    const bookmark = {
      title: bookmarkTitle.value,
      url: bookmarkUrl.value,
      notes: Array.from(noteInputsContainer.querySelectorAll(".input-note"))
      .map(input => input.value.trim())
      .filter(note => note !== "")
    };
    
    savedBookmarks.push(bookmark);
    noteInputsContainer.innerHTML = "";
    form.reset();
    displaySavedBookmarks();
  });

  function displaySavedBookmarks() {
    bookmarkContainer.innerHTML = savedBookmarks.map((bookmark, index) => `
    <div class="bookmark">
      <div class="bookmark-title">
        <p>${bookmark.title}</p>
        <div class="bookmark-controll">
          <button class="visit-bookmark"><a href="${bookmark.url}" target="_blank">Visit</a></button>
          <button class="remove-bookmark" data-index="${index}">Delete</button>
          ${bookmark.notes.length ? '<button class="collapse-btn"><i class="fa-solid fa-chevron-down"></i></button>' : ""}
        </div>
      </div>
      ${bookmark.notes.length ? 
        `<div class="notes-list">
          ${bookmark.notes.map(note => `<p class="note">- ${note}</p>`).join("")}
        </div>` : ""
      }
    </div>
    `).join("");
          
    bookmarkContainer.style.display = savedBookmarks.length ? "block" : "none";
  }
        
  bookmarkContainer.addEventListener("click" , (e)=>{
    if(e.target.parentElement.classList.contains("collapse-btn")){
      if(e.target.closest(".bookmark").classList.contains("show-notes")){
        e.target.closest(".bookmark").classList.remove("show-notes")
      }
      else{
        Array.from(bookmarkContainer.children).map(item => {
          item.classList.remove("show-notes")
        });
        e.target.closest(".bookmark").classList.add("show-notes")
      }

    }
  })
  bookmarkContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-bookmark")) {
      savedBookmarks.splice(e.target.dataset.index, 1);
      displaySavedBookmarks();
    }
  });
  
  function checkUrl(text) {
    const regExpUrl = /^((http|https):\/\/)(www\.)?[a-zA-Z]+\.\b(com|mail|org|edu)\b[\/\w+]?/i;
    return regExpUrl.test(text);
  }
});