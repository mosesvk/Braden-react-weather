
export function saveLinks(newLink, activeDotIndex, clickCount) {
    let existingLinks = localStorage.getItem("links")
      ? JSON.parse(localStorage.getItem("links"))
      : Array.from({ length: clickCount }, () => null);
  
    existingLinks[activeDotIndex] = newLink;
  
    if (existingLinks.length < clickCount) {
      existingLinks = Array.from({ length: clickCount }, (_, index) =>
        existingLinks[index] !== undefined ? existingLinks[index] : null
      );
    }
  
    localStorage.setItem("links", JSON.stringify(existingLinks));
    console.log("activeDotIndex: ", activeDotIndex);
    console.log('existing links: ', existingLinks);
  }
  