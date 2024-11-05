const token = '7854726117:AAHyAOKhQjXpAHZLR8SDEi3FqIGvInkYbz8'; // O'z tokeningizni kiriting

const getSongs = async (text, limit, offset) => {
    const types = 'songs,artists';
    const url = `https://www.shazam.com/services/amapi/v1/catalog/UZ/search?term=${encodeURIComponent(text)}&limit=${limit}&offset=${offset}&types=${types}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'sec-ch-ua-platform': '"Windows"',
                'Referer': 'https://www.shazam.com/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
                'Content-Type': 'application/json',
                'sec-ch-ua-mobile': '?0'
            }
        });

        const data = await response.json();

        if (data.results && data.results.songs && data.results.songs.data.length > 0) {
            const songs = data.results.songs.data;
            const results = songs.map(song => {
                const durationInSeconds = song.attributes.durationInMillis / 1000;
                const minutes = Math.floor(durationInSeconds / 60);
                const seconds = Math.floor(durationInSeconds % 60);
                const formattedDuration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

                return {
                    id: song.id,
                    name: song.attributes.name,
                    duration: formattedDuration,
                    artist: song.attributes.artistName,
                    preview_url: song.attributes.previews[0]?.url
                };
            });

            return {
                success: true,
                songs: results
            };
        } else {
            return {
                success: false,
                message: "Afsuski, musiqa topilmadi."
            };
        }
    } catch (error) {
        console.error("Xato:", error);
        return {
            success: false,
            message: "Tizimda xato yuz berdi."
        };
    }
};

// Foydalanish misoli
getSongs('your_search_term', 10, 0).then(result => {
    console.log(result);
});
