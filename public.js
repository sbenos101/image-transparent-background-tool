const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const resultsDiv = document.getElementById("results");

const progressContainer = document.createElement("div");
progressContainer.style.width = "100%";
progressContainer.style.background = "#ddd";
progressContainer.style.borderRadius = "5px";
progressContainer.style.margin = "10px 0";
progressContainer.style.height = "20px";
const progressBar = document.createElement("div");
progressBar.style.height = "100%";
progressBar.style.width = "0%";
progressBar.style.background = "#4caf50";
progressBar.style.transition = "width 0.2s";
progressContainer.appendChild(progressBar);
resultsDiv.parentNode.insertBefore(progressContainer, resultsDiv);

const progressText = document.createElement("p");
progressText.style.fontWeight = "bold";
resultsDiv.parentNode.insertBefore(progressText, resultsDiv);

uploadBtn.addEventListener("click", async () => {
  if (!fileInput.files.length) return alert("Select files first.");

  const files = Array.from(fileInput.files);
  const total = files.length;
  let processed = 0;

  progressBar.style.width = "0%";
  progressText.textContent = `Processing 0 of ${total} images...`;
  resultsDiv.innerHTML = "";

  const formData = new FormData();
  files.forEach(file => formData.append("images", file));

  try {
    const res = await fetch("/compress-upload", { method: "POST", body: formData });
    const data = await res.json();

    data.images.forEach((url, index) => {
      const div = document.createElement("div");
      const img = document.createElement("img");
      img.src = url;
      img.style.maxWidth = "200px";
      img.style.margin = "10px";

      const a = document.createElement("a");
      a.href = url;
      a.download = url.split("/").pop();
      a.textContent = `Download ${url.split("/").pop()}`;
      a.style.display = "block";

      div.appendChild(img);
      div.appendChild(a);
      resultsDiv.appendChild(div);

      processed++;
      const percent = Math.round((processed / total) * 100);
      progressBar.style.width = percent + "%";
      progressText.textContent = `Processing ${processed} of ${total} images...`;
    });
  } catch (err) {
    console.error(err);
    resultsDiv.textContent = "Error compressing images";
  }
});
