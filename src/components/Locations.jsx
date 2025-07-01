import { useState, useEffect } from 'react' 

function Locations() {
    const [locData, setLocData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await new Promise((resolve) => setTimeout(resolve, 500)); 

            const mockData = [
                { location: 'Library', utility: 'Study' },
                { location: 'Tech Commons', utility: 'Study' },
                { location: 'Lineage Coffee Roasters', utility: 'Study' },
                { location: 'Burnett Honors College', utility: 'Study' },
                { location: 'Student Union', utility: 'Social' },
                { location: 'Haan Coffee', utility: 'Social' },
                { location: 'Foxtail (on-campus)', utility: 'Versatile' }
            ];

            setLocData(mockData);
        };

        fetchData();
    }, []);

    return (
        <>
            <div className="max-w-7xl mx-auto mt-10 pg-4 bg-white shadow rounded text-center">
                <div className="overflow-y-scroll max-h-64 border rounded">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-400 text-white sticky top-0 text-2xl">
                            <tr>
                                <th className="px-4 py-2 font-semibold">Location</th>
                                <th className="px-4 py-2 font-semibold">Vibe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locData.map((item, idx) => (
                            <tr key={idx} className="odd:bg-gray-500 even:bg-gray-600 text-xl text-white">
                                <td className="px-4 py-2">{item.location}</td>
                                <td className="px-4 py-2">{item.utility}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default Locations;