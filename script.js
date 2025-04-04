let n = 100;
const array = [];

let speed = 50;  // Default speed

// Updates speed based on slider input
function updateSpeed(value) {
    speed = 100 - value;      // Inverse the value for speed (lower value = faster animation)
}

function updateBarCount(value) {
    n = value;  // Update the number of bars
    init();  // Reinitialize the bars with the new count

    const containerWidth = 800;  // Adjust based on your container's width
    const barMargin = 1;  // Margin of each bar
    const totalMargins = (n - 1) * barMargin;  // Total margins for all bars

    const availableWidth = containerWidth - totalMargins;  // Width available for bars
    const barWidth = availableWidth / n;  // Calculate new bar width

    // Set the new bar width in CSS
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        bar.style.width = `${barWidth}px`;  // Update width of each bar
    });

}


// Function to disable or enable sorting buttons
function toggleButtons(disable) {
    const buttons = document.querySelectorAll('.controls button');
    buttons.forEach(button => {
        button.disabled = disable;
    });
}



init();

let audioCtx = null;

function playNote(freq) {
    if (audioCtx == null) {
        audioCtx = new (
            AudioContext ||
            webkitAudioContext ||
            window.webkitAudioContext
        )();
    }
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime + dur
    );
    osc.connect(node);
    node.connect(audioCtx.destination);
}

function init() {
    toggleButtons(false);  // Disable buttons before starting the sort
    array.length = 0; // clearing the exiting array
    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }
    showBars();
}

function bubbleSortPlay() {
    toggleButtons(true);  // Disable buttons before starting the sort
    const copy = [...array];
    const moves = bubbleSort(copy);
    animate(moves);
}

function selectionSortPlay() {
    toggleButtons(true);  // Disable buttons before starting the sort
    const copy = [...array];
    const moves = selectionSort(copy);
    animate(moves);
}

function insertionSortPlay() {
    toggleButtons(true);  // Disable buttons before starting the sort
    const copy = [...array];
    const moves = insertionSort(copy);
    animate(moves);
}

function quickSortPlay() {
    toggleButtons(true);  // Disable buttons before starting the sort
    const copy = [...array];
    const moves = [];
    quickSortHelper(copy, 0, copy.length - 1, moves);
    animateQuickSort(moves);
}

function mergeSortPlay() {
    toggleButtons(true);  // Disable buttons before starting the sort
    const copy = [...array];
    const moves = [];
    mergeSortHelper(copy, 0, copy.length - 1, moves);
    animateMergeSort(moves);
}


function animate(moves) {
    if (moves.length == 0) {
        showBars();
        toggleButtons(false);  // Re-enable buttons when sorting is done
        return;
    }
    const move = moves.shift();
    const [i, j] = move.indices;

    if (move.type == "swap") {
        [array[i], array[j]] = [array[j], array[i]];
    }

    playNote(200 + array[i] * 500);
    playNote(200 + array[j] * 500);

    showBars(move);
    setTimeout(function () {
        animate(moves);
    }, speed);
}

function bubbleSort(array) {
    const moves = [];
    do {
        var swapped = false;
        for (let i = 1; i < array.length; i++) {

            moves.push({ indices: [i - 1, i], type: "comp" });

            if (array[i - 1] > array[i]) {
                swapped = true;
                moves.push({ indices: [i - 1, i], type: "swap" });
                [array[i - 1], array[i]] = [array[i], array[i - 1]];
            }
        }
    } while (swapped);
    return moves;
}

function selectionSort(arr) {
    const moves = [];
    let n = arr.length;
    let min;
    for (let i = 0; i < n - 1; ++i) {
        min = i;
        for (let j = i + 1; j < n; j++) {
            moves.push({ indices: [min, i], type: "comp" });
            if (arr[j] < arr[min]) min = j;
        }

        if (min != i)
            moves.push({ indices: [min, i], type: "swap" });
        [arr[min], arr[i]] = [arr[i], arr[min]]
    }
    return moves;
}

function insertionSort(arr) {
    const moves = [];
    let memIndex = 0
    for (let i = 0; i < arr.length; i++) {
        memIndex = i;
        for (let j = i + 1; j >= 0; --j) {

            if (arr[j] >= arr[i]) {
                break;
            }
            if (arr[j] < arr[i]) {

                moves.push({ indices: [i, j], type: "swap" });
                var temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                i = i - 1;
            }
        }
        i = memIndex;
    }
    return moves;
}



function quickSortHelper(arr, left, right, moves) {
    if (left >= right) return;
    const pivotIndex = partition(arr, left, right, moves);
    quickSortHelper(arr, left, pivotIndex - 1, moves);
    quickSortHelper(arr, pivotIndex, right, moves);
}

function partition(arr, left, right, moves) {
    const pivotIndex = Math.floor((left + right) / 2);
    const pivotValue = arr[pivotIndex];
    let i = left;
    let j = right;

    moves.push({ indices: [pivotIndex], type: "pivot" });

    while (i <= j) {
        while (arr[i] < pivotValue) {
            moves.push({ indices: [i], type: "comp" });
            i++;
        }
        while (arr[j] > pivotValue) {
            moves.push({ indices: [j], type: "comp" });
            j--;
        }
        if (i <= j) {
            moves.push({ indices: [i, j], type: "swap" });
            [arr[i], arr[j]] = [arr[j], arr[i]];
            i++;
            j--;
        }
    }
    return i;
}

function animateQuickSort(moves) {
    if (moves.length == 0) {
        showBars();
        toggleButtons(false);  // Re-enable buttons when sorting is done
        return;
    }

    const move = moves.shift();
    const [i, j] = move.indices;

    if (move.type == "swap") {
        [array[i], array[j]] = [array[j], array[i]];
        playNote(200 + array[i] * 500);
        playNote(200 + array[j] * 500);
    } else if (move.type == "pivot") {
        playNote(500);  // Special sound for the pivot
    }

    showBars(move);
    setTimeout(function () {
        animateQuickSort(moves);
    }, speed);  // Slower animation for quick sort for better clarity
    
}

function mergeSortHelper(arr, left, right, moves) {
    if (left >= right) {
        return;
    }

    const mid = Math.floor((left + right) / 2);

    mergeSortHelper(arr, left, mid, moves);     // Sort left half
    mergeSortHelper(arr, mid + 1, right, moves);  // Sort right half
    merge(arr, left, mid, right, moves);        // Merge the sorted halves
}


function merge(arr, left, mid, right, moves) {
    let leftArr = arr.slice(left, mid + 1);
    let rightArr = arr.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
        // Compare left and right arrays
        moves.push({ indices: [k], type: "comp" });

        if (leftArr[i] <= rightArr[j]) {
            moves.push({ indices: [k], type: "set", value: leftArr[i] });
            arr[k++] = leftArr[i++];
        } else {
            moves.push({ indices: [k], type: "set", value: rightArr[j] });
            arr[k++] = rightArr[j++];
        }
    }

    // Copy the remaining elements of leftArr, if any
    while (i < leftArr.length) {
        moves.push({ indices: [k], type: "set", value: leftArr[i] });
        arr[k++] = leftArr[i++];
    }

    // Copy the remaining elements of rightArr, if any
    while (j < rightArr.length) {
        moves.push({ indices: [k], type: "set", value: rightArr[j] });
        arr[k++] = rightArr[j++];
    }
}

function animateMergeSort(moves) {
    if (moves.length === 0) {
        showBars();
        toggleButtons(false);  // Re-enable buttons when sorting is done
        return;
    }

    const move = moves.shift();
    const [i] = move.indices;

    if (move.type === "set") {
        array[i] = move.value;
        playNote(200 + array[i] * 500);
    }

    showBars(move);
    setTimeout(function () {
        animateMergeSort(moves);
    }, speed);  // Adjust the speed of the merge sort animation
}

function showBars(move) {
    const container = document.getElementById('container');  
    container.innerHTML = "";  // Clear the container before adding new bars

    const containerWidth = 800;  
    const barMargin = 1;
    const totalMargins = (n - 1) * barMargin;
    const availableWidth = containerWidth - totalMargins;
    const barWidth = availableWidth / n;

    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%";
        bar.style.width = `${barWidth}px`;  // Set the bar width dynamically
        bar.style.marginRight = `${barMargin}px`;  // Set the margin between bars
        bar.classList.add("bar");

        
        bar.addEventListener("mouseover", function() {
            const roundedHeight = Math.round(array[i] * 100);  // Round off height value
            const heightLabel = document.createElement("div");
            heightLabel.innerText = `${roundedHeight}`;
            heightLabel.classList.add("height-label");

            bar.appendChild(heightLabel);  // Add the height label to the bar
            bar.style.width = `${barWidth + 15}px`;  // Increase the width of the hovered bar
        });

        // Remove hover effects on mouseout
        bar.addEventListener("mouseout", function() {
            const heightLabel = bar.querySelector(".height-label");
            if (heightLabel) {
                bar.removeChild(heightLabel);  // Remove the height label
            }
            bar.style.width = `${barWidth}px`;  
        });

        // Highlight bars based on the current move
        if (move && move.indices.includes(i)) {
            bar.style.backgroundColor =
                move.type === "swap" ? "red" :
                move.type === "comp" ? "blue" :
                move.type === "pivot" ? "purple" :
                move.type === "set" ? "green" : "blue";
        }

        container.appendChild(bar);  // Add the bar to the container
    }
}



function showCode(sortType) {
    const codeDisplay = document.getElementById("code-display");
    const javaCodeElement = document.getElementById("java-code");

    let javaCode = "";

    switch (sortType) {
        case 'mergeSort':
            javaCode = `
public class MergeSort {
    public static void mergeSort(int[] array) {
        if (array.length < 2) {
            return; // Base case
        }
        int mid = array.length / 2;
        int[] left = Arrays.copyOfRange(array, 0, mid);
        int[] right = Arrays.copyOfRange(array, mid, array.length);

        mergeSort(left); // Sort left half
        mergeSort(right); // Sort right half

        merge(array, left, right); // Merge sorted halves
    }

    private static void merge(int[] array, int[] left, int[] right) {
        int i = 0, j = 0, k = 0;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                array[k++] = left[i++];
            } else {
                array[k++] = right[j++];
            }
        }
        while (i < left.length) {
            array[k++] = left[i++];
        }
        while (j < right.length) {
            array[k++] = right[j++];
        }
    }
}
            `;
            break;
        case 'quickSort':
            javaCode = `
    public class QuickSort {
    public static void quickSort(int[] array, int low, int high) {
        if (low < high) {
            int pivotIndex = partition(array, low, high);
            quickSort(array, low, pivotIndex - 1);
            quickSort(array, pivotIndex + 1, high);
        }
    }

    private static int partition(int[] array, int low, int high) {
        int pivot = array[high];
        int i = low - 1;
        
        for (int j = low; j < high; j++) {
            if (array[j] <= pivot) {
                i++;
                int temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }

        int temp = array[i + 1];
        array[i + 1] = array[high];
        array[high] = temp;

        return i + 1;
    }

            `;
            break;
        
        
    }

    javaCodeElement.textContent = javaCode; // Set the code text
    codeDisplay.style.display = "block"; // Show the code display
}

function copyCode() {
    const codeElement = document.getElementById("java-code");
    const code = codeElement.textContent; // Get the code

    navigator.clipboard.writeText(code).then(() => {
        alert("Code copied to clipboard!"); // Alert the user
    }).catch(err => {
        console.error("Error copying code: ", err);
    });
}


// background animation logic
particlesJS('particles-js', {
    particles: {
        number: { value: 80 },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        opacity: { value: 0.5 },
        size: { value: 3 },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
        }
    },
    retina_detect: true
});

