function dist(a,b)
{
    return Math.hypot(a.x - b.x,a.y - b.y);
}

export function fingersUp(lm)
{
    if(!lm || lm.length !== 21)
    {
        return null;
    }

    const wrist = lm[0];
    const pinkyKnucle = lm[17];

    const thumb = dist(lm[4], pinkyKnucle) > dist(lm[3], pinkyKnucle);

    const index = dist(lm[8], wrist) > dist(lm[6], wrist);

    const middle = dist(lm[12], wrist) > dist(lm[10], wrist);

    const ring = dist(lm[16], wrist) > dist(lm[14], wrist);

    const pinky = dist(lm[20], wrist) > dist(lm[18], wrist);

    return [thumb, index, middle, ring, pinky];
}
export function classify(landmarks)
{
    if(!landmarks)
    {
        return null;
    }
    const fingers = fingersUp(landmarks);

    const [thumb, index, middle, ring, pinky] = fingers;

    const count = fingers.filter(Boolean).length;

    if (count === 0) {
        return "Fist";
    }

    if (count === 5) {
        return "Open Palm";
    }

    if (index && !thumb && !middle && !ring && !pinky) {
        return "Pointing";
    }

    if (index && middle && !thumb && !ring && !pinky) {
        return "Peace";
    }

    if (
        thumb &&
        !index &&
        !middle &&
        !ring &&
        !pinky &&
        landmarks[4].y < landmarks[0].y
    ) {
        return "Thumbs Up";
    }

    return `${count} fingers`;
}