const canvas = document.querySelector("canvas");
export function drawHand(canvas, landmarks)
{
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(!landmarks)
    {
        return;
    }
}