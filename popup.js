let scraperEmails = document.getElementById("scrapeEmails");

let list = document.getElementById("emailList");

//Handler to receive emails form content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  let emails = request.emails;
  //alert(emails);
  const uniqueEmails = [];
  emails.forEach((element) => {
    if (!uniqueEmails.includes(element)) {
      uniqueEmails.push(element);
    }
  });

  if (uniqueEmails == null || uniqueEmails.length == 0) {
    let li = document.createElement("li");
    li.innerText = "No emails found";
    list.appendChild(li);
  } else {
    uniqueEmails.forEach((email) => {
      let li = document.createElement("li");
      li.innerText = email;
      list.appendChild(li);
    });
  }
});

//Button EventHandler
scraperEmails.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Check if the tab URL is a valid web URL
  if (tab.url.startsWith("http://") || tab.url.startsWith("https://")) {
    // Execute script to parse emails on the page
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: scrapeEmailsFromPage,
    });
  } else {
    console.log("Invalid URL: Cannot scrape emails from this page.");
  }
});

//Function to scrape emails
function scrapeEmailsFromPage() {
  let regex = /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/gim;
  let emails = document.body.innerHTML.match(regex);

  //Send Emails to popup
  chrome.runtime.sendMessage({ emails });
}
