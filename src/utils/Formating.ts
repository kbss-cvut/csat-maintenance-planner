export const formatYear = (est: number | null | undefined) => {
    if(!est)
        return "";
    const years = Math.floor(est);
    let days = Math.floor((est - years)*365);
    const weeks = Math.floor(days/7)
    days = days%7;
    return years + 'y' + weeks + 'w' + (days ? days + 'd' : '');
}

export const shortTimeSlots = [
    ['m', 60, 60],
    ['h', 60*60,24],
    ['d',24*60*60,7],
    ['w',7*24*60*60]
];

export const formatDuration = (est: number | null | undefined, timeSlots) => {
    if(!est)
        return "-";
    let formatted = "";
    for(let i = timeSlots.length -1 ; i > -1; i --){
        let slot = timeSlots[i];
        //@ts-ignore
        let val = Math.floor(est/slot[1]);
        if(val == 0)
            continue;

        if(slot.length > 2)
            //@ts-ignore
            val = val%slot[2];
        formatted = formatted + val + slot[0];
    }
    return formatted;
}
