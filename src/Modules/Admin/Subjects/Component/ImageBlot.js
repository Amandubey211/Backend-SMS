import Quill from "quill";

const BlockEmbed = Quill.import("blots/block/embed");

class ImageBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.setAttribute("src", value);
    node.classList.add("relative", "inline-block", "w-full", "h-auto");

    const removeButton = document.createElement("button");
    removeButton.className = "absolute top-0 z-10  right-0 m-1 p-1 bg-red-500 text-white rounded-full cursor-pointer";
    removeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';
    
    removeButton.onclick = () => {
      node.remove();
    };

    node.appendChild(removeButton);
    return node;
  }

  static value(node) {
    return node.getAttribute("src");
  }
}

ImageBlot.blotName = "image";
ImageBlot.tagName = "img";

Quill.register(ImageBlot);
