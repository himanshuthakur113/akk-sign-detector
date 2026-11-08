let forest = null;

export async function loadModel()
{
    const response = await fetch("./assets/models/rf_v1.json");
    if(!response.ok)
    {
        throw new Error("failed to load random forest model");
    }

    forest = await response.json();
}

function predictTree(tree, features)
{
    let node = 0;
    while(tree.left[node] !== -1)
    {
        const feature = tree.feature[node];
        const threshold = tree.threshold[node];

        if(features[feature] <= threshold)
        {
            node = tree.left[node];
        }
        else
        {
            node = tree.right[node];
        }
    }
    return tree.value[node];
}

export function predictSign(features)
{
    if(!forest)
    {
        throw new Error("model not been loaded");
    }

    if(features.length !== forest.n_features)
    {
        throw new Error("expected 42 hand features");
    }

    const total = new Array(forest.classes.length).fill(0);

    for(const tree of forest.trees)
    {
        const probabilities = predictTree(tree, features);
        for(let i = 0;i < total.length; i++)
        {
            total[i] += probabilities[i];
        }
    }

    const average = total.map(
        value => value/forest.trees.length
    );

    let bestIndex = 0;

    for(let i = 1;i < average.length; ++i)
    {
        if(average[i] > average[bestIndex])
        {
            bestIndex = i;
        }
    }

    return {
        label: forest.classes[bestIndex],
        confidence: average[bestIndex],
        probabilities: average
    };
}

export function extractFeatures(landmarks)
{   
    const wrist = landmarks[0]
    const features = []

    for(const point of landmarks)
    {
        features.push(point.x - wrist.x);
        features.push(point.y - wrist.y);
    }
    return features;
}