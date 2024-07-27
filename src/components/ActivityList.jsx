import { useEffect, useState } from "react";

const ActivityList = () => {


    const [searchValue, setSearchValue] = useState([])


    const [searchText, setSearchText] = useState("")


    const [tagdata, setTagData] = useState([])


    const [dateData, setDateData] = useState([])

    const [selectedDate, setSelectedDate] = useState("")

    const [selectedType, setSelectedType] = useState("")



    const [pageCount, setpageCount] = useState(1);

    const [totalCount, setTotalCount] = useState(0)

    let limit = 5;





    useEffect(() => {
        fetch(`https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats?search=${searchText}&page=${pageCount}&limit=${limit}`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setSearchValue(data.filter(f => f.title.toLowerCase().includes(searchText)))
                console.log("search API", data);

            });
    }, [searchText, pageCount]);


    useEffect(() => {
        fetch(`https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                let tags = data.map(tag => {
                    return tag.tag
                })
                let uniqueArray = [...new Set(tags.flat())];
                setTagData(uniqueArray);
                console.log("Tag API", uniqueArray);

                let dates = data.map(date => {
                    return date.date
                })
                setDateData(dates)
                setTotalCount(data.length)

            });
    }, [])


    const fetchDataByTagAndDateHandler = (choice) => {
        fetch(`https://669f704cb132e2c136fdd9a0.mockapi.io/api/v1/retreats?filter=${choice}`)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setSearchValue(data);
            });
    }


    function convertTimestampToDate(timestamp) {
        let date = new Date(timestamp * 1000);


        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
        let hours = ("0" + date.getHours()).slice(-2);
        let minutes = ("0" + date.getMinutes()).slice(-2);
        let seconds = ("0" + date.getSeconds()).slice(-2);

        let formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedDate;
    }



    const handelChange = (event) => {
        setSearchText(event.target.value)
    }

    return (
        <div>

            <div className="bg-gray-100">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="flex justify-between max-[767.98px]:flex-col">

                        <div className="flex gap-4 max-[767.98px]:flex-col  max-[767.98px]:gap-2">
                            <select value={selectedDate} id="date" className="bg-inputColor rounded-md w-32 max-[767.98px]:w-full py-2"
                                onChange={(e) => {
                                    fetchDataByTagAndDateHandler(e.target.value);
                                    setSelectedDate(e.target.value)
                                }}
                            >
                                <option value="" disabled={true}>Filter By Date</option>
                                {
                                    dateData.map((value, index) => (
                                        <option className="text-white" key={index} value={value}>{convertTimestampToDate(value)}</option>
                                    ))
                                }

                            </select>
                            <select id="type" value={selectedType} 
                            className="bg-inputColor rounded-md w-32 max-[767.98px]:w-full py-2 max-[767.98px]:bg-slate-200"
                                onChange={(e) => {
                                    fetchDataByTagAndDateHandler(e.target.value)
                                    setSelectedType(e.target.value)
                                }}>
                                <option value="" className="text-white" disabled={true}>Filter By Type</option>
                                {
                                    tagdata.map((value, index) => (
                                        <option className="text-white" key={index} value={value}>{value}</option>
                                    ))
                                }

                            </select>
                        </div>

                        <input type="text" id="fname" name="fname"
                            className="w-72 px-2 rounded-md placeholder:text-white bg-inputColor pb-2 opacity-100 pt-1 max-[767.98px]:w-full mt-2"
                            placeholder="Search retreats by title" value={searchText} onChange={handelChange}></input>

                    </div>
                    <div className="mx-auto max-w-2xl lg:max-w-none">

                        <div className="mt-6 space-y-6 lg:grid lg:grid-cols-5 lg:gap-x-6 lg:space-y-0 ">
                            {
                                searchValue.map((value, index) => (
                                    <div className="group relative bg-groupcolor p-4 rounded-lg" key={index}>
                                        <div className="relative w-56 sm:h-44 rounded-2xl max-[767.98px]:w-72 max-[767.98px]:h-72">
                                            <img src={value.image} alt="Desk with leather desk pad, walnut desk organizer, wireless keyboard and mouse, and porcelain mug." className="h-full w-full object-cover object-center rounded-lg" />
                                        </div>
                                        <h3 className="mt-6 text-sm text-gray-500">
                                            {value.title}
                                        </h3>
                                        <p className="text-base  text-gray-900">{value.description}</p>
                                        <p className="text-base  text-gray-900">Location: {value.location}</p>
                                        <p className="text-base font-semibold text-gray-900 priceColor">Price: {value.price}</p>

                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between max-w-48 mx-auto mt-20">
                <button className="bg-inputColor p-2 rounded-sm text-white" 
                 onClick={() => { if (pageCount > 1) { setpageCount((prev) => prev - 1) } }}>Previous</button>
                <button className="bg-inputColor p-2 rounded-sm text-white"
                 onClick={() => { if (pageCount * limit < totalCount) { setpageCount((prev) => prev + 1) } }}>Next</button>
            </div>

        </div>
    )
}

export default ActivityList;