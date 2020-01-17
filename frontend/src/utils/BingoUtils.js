export const getWinningBoardState = (buzzwords) => {
    let winningState = [];
    let win = false;

    // Check rows
    for (let i = 0; i < buzzwords.length; i++) {
        win = true;

        for (let j = 0; j < buzzwords.length; j++) {
            if (!buzzwords[i][j].selected) {
                win = false;
            }

            winningState.push([i, j]);
        }

        if (win) {
            return winningState;
        } else {
            winningState = [];
        }
    }

    // Check columns
    for (let i = 0; i < buzzwords.length; i++) {
        win = true;

        for (let j = 0; j < buzzwords.length; j++) {
            if (!buzzwords[j][i].selected) {
                win = false;
            }

            winningState.push([j, i]);
        }

        if (win) {
            return winningState;
        } else {
            winningState = [];
        }
    }

    // Check diagonals
    win = true;
    for (let i = 0; i < buzzwords.length; i++) {
        if (!buzzwords[i][i].selected) {
            win = false;
        }

        winningState.push([i, i]);
    }

    if (win) {
        return winningState;
    } else {
        winningState = [];
    }

    win = true;
    for (let i = 0; i < buzzwords.length; i++) {
        if (!buzzwords[i][4-i].selected) {
            win = false;
        }

        winningState.push([i, 4-i]);
    }

    if (win) {
        return winningState;
    } else {
        winningState = [];
    }

    return winningState;
};

export const shuffleWords = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }

    let chunked_array = [];

    for (let i = 0, j = a.length; i < j; i += 5) {
        const objs = a.slice(i, i+5).map((text) => ({text, selected: false}));
        chunked_array.push(objs);
    }

    chunked_array[2][2].text += " (FREE)";
    chunked_array[2][2].selected = true;

    return chunked_array;
};
