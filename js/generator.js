const fillWithPoints = (n, worldMap) => {
    let arrayOfPoints = []
    for (let i = 0; i < n; i++) {
        let x = getRandomInRange(0, worldMap.canvas.width);
        let y = getRandomInRange(0, worldMap.canvas.height);
        arrayOfPoints.push([x,y]);
    }
    return arrayOfPoints;
}