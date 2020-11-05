const inputFile = document.querySelector(
  "input[type=file]"
) as HTMLInputElement;
inputFile.addEventListener("change", ev => {
  const file = ((ev as Event).target as HTMLInputElement).files![0];
  if (file.type != "image/jpeg" && file.type != "image/png") {
    alert("画像ではありません");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.src = reader.result as string;
    image.onload = () => {
      const canvas = document.querySelector("canvas") as HTMLCanvasElement;
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      ctx.clearRect(0, 0, image.width, image.height);
      ctx.drawImage(image, 0, 0, image.width, image.height);

      ctx.fillStyle = "rgba(0,0,0,.8)";
      ctx.fillRect(0, 0, image.width, image.height);

      const r = image.width > image.height ? image.width / 2 : image.height / 2;
      const grad = ctx.createRadialGradient(
        image.width / 2,
        image.height / 2,
        r / 2,
        image.width / 2,
        image.height / 2,
        r
      );
      grad.addColorStop(0.0, "rgba(255,0,0,0)");
      grad.addColorStop(1.0, "rgba(255,0,0,.2)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, image.width, image.height);

      // ctx.fillStyle = "red";
      // ctx.font = `${r / 4}px '游明朝'`;
      // ctx.fillText("死", image.width / 2 - r / 8, image.height / 2);

      // ctx.font = `${r / 16}px '游明朝'`;
      // ctx.fillText("DEATH", image.width / 2 - r / 8, image.height / 2 + r / 8);

      const textImg = new Image();
      textImg.onload = () => {
        ctx.drawImage(textImg, image.width / 2 - r / 4, image.height / 2 - r / 4, r / 2, r / 2);
      };
      textImg.src = './death.png';
    };
  };
  reader.readAsDataURL(file);
});

const dlBtn = document.querySelector("button") as HTMLButtonElement;
dlBtn.addEventListener("click", () => {
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;
  const dl = document.createElement("a");
  dl.href = window.URL.createObjectURL(
    Base64toBlob(canvas.toDataURL("image/png"))
  );
  dl.download = "sekiro.png";
  dl.click();
});

const Base64toBlob = (base64: string) => {
  const tmp = base64.split(",");
  const data = atob(tmp[1]);
  const mime = tmp[0].split(":")[1].split(";")[0];
  const buf = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    buf[i] = data.charCodeAt(i);
  }
  const blob = new Blob([buf], { type: mime });
  return blob;
};
