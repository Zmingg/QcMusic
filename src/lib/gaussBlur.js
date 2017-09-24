function gaussBlur(imgData,radius,sigma) {
    radius = radius || 3;
    sigma = sigma || radius / 3;

    let gaussEdge = radius * 2 + 1;    // 高斯矩阵的边长

    let gaussMatrix = [],
        gaussSum = 0,
        a = 1 / (2 * sigma * sigma * Math.PI),
        b = -a * Math.PI;

    for (let i=-radius; i<=radius; i++) {
        for (let j=-radius; j<=radius; j++) {
            let gxy = a * Math.exp((i * i + j * j) * b);
            gaussMatrix.push(gxy);
            gaussSum += gxy;    // 得到高斯矩阵的和，用来归一化
        }
    }

    let gaussNum = gaussEdge * gaussEdge;
    for (let i=0; i<gaussNum; i++) {
        gaussMatrix[i] = gaussMatrix[i] / gaussSum;    // 归一化高斯矩阵
    }

    let width = imgData.width;
    let height = imgData.height;
    let pixes = imgData.data;

    for (let x=0; x<width;x++) {
        for (let y=0; y<height; y++) {
            let r = 0,
                g = 0,
                b = 0;

            // 计算每个点的高斯处理之后的值
            for (let i=-radius; i<=radius; i++) {
                // 修正X轴越界
                let m = handleEdge(i, x, width);
                for (let j=-radius; j<=radius; j++) {
                    // 修正轴越界
                    let mm = handleEdge(j, y, height);

                    let currentPixId = (mm * width + m) * 4;

                    let jj = j + radius;
                    let ii = i + radius;
                    r += pixes[currentPixId] * gaussMatrix[jj * gaussEdge + ii];
                    g += pixes[currentPixId + 1] * gaussMatrix[jj * gaussEdge + ii];
                    b += pixes[currentPixId + 2] * gaussMatrix[jj * gaussEdge + ii];

                }
            }
            let pixId = (y * width + x) * 4;

            pixes[pixId] = ~~r;
            pixes[pixId + 1] = ~~g;
            pixes[pixId + 2] = ~~b;
        }
    }

    function handleEdge(i, x, w) {
        let  m = x + i;
        if (m < 0) {
            m = -m;
        } else if (m >= w){
            m = 2 * w - x - i - 1;
        }
        return m;
    }

    return imgData;
}

function gaussBlur2(imgData,radius,sigma) {
    radius = radius || 3;
    sigma = sigma || radius / 3;

    let pixes = imgData.data;
    let width = imgData.width;
    let height = imgData.height;
    let gaussMatrix = [],
        gaussSum = 0,
        x, y,
        r, g, b, a,
        id, i, k, len;

    a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
    b = -1 / (2* sigma * sigma) ;

    for (x = -radius,i = 0; x <= radius; x++, i++) {
        g = a * Math.exp(b * x * x);
        gaussMatrix[i] = g;
        gaussSum += g;
    }

    for (i = 0, len = gaussMatrix.length; i < len; i++) {
        gaussMatrix[i] /= gaussSum;
    }

    //x 方向一维高斯运算
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            r = g = b = a = 0;
            gaussSum = 0;
            for(i = -radius; i <= radius; i++){
                k = x + i;
                if(k >= 0 && k < width){//确保 k 没超出 x 的范围
                    //r,g,b,a 四个一组
                    id = (y * width + k) * 4;
                    r += pixes[id] * gaussMatrix[i + radius];
                    g += pixes[id + 1] * gaussMatrix[i + radius];
                    b += pixes[id + 2] * gaussMatrix[i + radius];
                    // a += pixes[id + 3] * gaussMatrix[i];
                    gaussSum += gaussMatrix[i + radius];
                }
            }
            id = (y * width + x) * 4;
            // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
            // console.log(gaussSum)
            pixes[id] = r / gaussSum;
            pixes[id + 1] = g / gaussSum;
            pixes[id + 2] = b / gaussSum;
            // pixes[id + 3] = a ;

        }
    }

    //y 方向一维高斯运算
    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            r = g = b = a = 0;
            gaussSum = 0;
            for(i = -radius; i <= radius; i++){
                k = y + i;
                if(k >= 0 && k < height){//确保 k 没超出 y 的范围
                    id = (k * width + x) * 4;
                    r += pixes[id] * gaussMatrix[i + radius];
                    g += pixes[id + 1] * gaussMatrix[i + radius];
                    b += pixes[id + 2] * gaussMatrix[i + radius];
                    // a += pixes[i + 3] * gaussMatrix[i];
                    gaussSum += gaussMatrix[i + radius];
                }
            }
            id = (y * width + x) * 4;
            pixes[id] = r / gaussSum;
            pixes[id + 1] = g / gaussSum;
            pixes[id + 2] = b / gaussSum;
            // pixes[id] = r ;
            // pixes[id + 1] = g ;
            // pixes[id + 2] = b ;
            // pixes[id + 3] = a ;
        }
    }

    return imgData;

}



export default gaussBlur2;