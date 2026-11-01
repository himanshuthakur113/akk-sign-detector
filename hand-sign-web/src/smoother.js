export function createSmoother(framesNeedee = 8)
{
    let candidate = null;
    let count = 0;
    let stable = null;

    function update(sign)
    {
        if(sign === candidate)
        {
            count++;
        }
        else
        {
            candidate = sign;
            count = 1;
        }

        if(count >= framesNeedee)
        {
            stable = candidate;
        }

        return stable;
    }

    return {update};
}

