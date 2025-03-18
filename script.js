const mbtiTypes = [
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP",
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP"
];

function calculateRP(mbti1, mbti2) {
    if (mbti1.length !== 4 || mbti2.length !== 4) return 0;

    let score = 0;

    // I/E 一致 +0.5
    if (mbti1[0] === mbti2[0]) score += 20;

    // N/S 一致 +1
    if (mbti1[1] === mbti2[1]) score += 40;

    // T/F 不一致 +0.75
    if (mbti1[2] !== mbti2[2]) score += 30;

    // J/P 不一致 +0.25
    if (mbti1[3] !== mbti2[3]) score += 10;

    if (mbti1 === mbti2) score = 100;

    return parseFloat(score.toFixed(2));
}

function getRating(score) {
    if (score >= 100) return "S";
    if (score >= 80) return "A";
    if (score >= 60) return "B";
    if (score >= 40) return "C";
    if (score >= 20) return "D";
    return "E";
}

// 比较两个 MBTI，显示配对结果
function compareTwoMBTI() {
    const mbti1 = document.getElementById("mbti1").value.toUpperCase();
    const mbti2 = document.getElementById("mbti2").value.toUpperCase();
    const result = document.getElementById("compareResult");

    if (!mbtiTypes.includes(mbti1) || !mbtiTypes.includes(mbti2)) {
        result.innerHTML = "请输入有效的 MBTI 类型（如 INTJ）";
        return;
    }

    const score = calculateRP(mbti1, mbti2);
    const rating = getRating(score);
    result.innerHTML = `匹配评分：${score}（${rating} 级）`;
}

// 计算所有 MBTI 和用户输入的匹配评分，按分数排序
function calculateMatches() {
    const userMbti = document.getElementById("userMbti").value.toUpperCase();
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (!mbtiTypes.includes(userMbti)) {
        resultsDiv.innerHTML = "<p>请输入有效的 MBTI 类型（如 INTJ）</p>";
        return;
    }

    let matchScores = mbtiTypes.map(mbti => ({
        type: mbti,
        score: calculateRP(userMbti, mbti),
        rating: getRating(calculateRP(userMbti, mbti))
    }));

    matchScores.sort((a, b) => b.score - a.score);

    const categorizedResults = {
        "S": [],
        "A": [],
        "B": [],
        "C": [],
        "D": [],
        "E": []
    };

    matchScores.forEach(({ type, rating }) => {
        categorizedResults[rating].push(type);
    });

    let resultHTML = "";
    for (const rating in categorizedResults) {
        if (categorizedResults[rating].length > 0) {
            resultHTML += `<h4 class="rating">${rating} 级：</h4><ul>`;
            categorizedResults[rating].forEach(mbti => {
                resultHTML += `<li>${mbti}</li>`;
            });
            resultHTML += "</ul>";
        }
    }

    resultsDiv.innerHTML = resultHTML;
}