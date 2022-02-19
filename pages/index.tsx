import type { NextPage } from "next";
import LeftBar from "./components/LeftBar";
import MainContents from "./components/MainContents";
import MidBar from "./components/MidBar";
import axios from "axios";
import { useState, useEffect } from "react";

const Home: NextPage = () => {
	const [summonerName, setSummonerName] = useState(["Hide on bush"]);
	const [searchData, setSearchData] = useState([]);
	async function searchSummoner() {
		const { data } = await axios.get(
			`https://codingtest.op.gg/api/summoner/${summonerName}`
		);
		setSearchData(data.summoner);
	}
	const keyPress = (e) => {
		if (e.key === "Enter") {
			searchSummoner();
		}
	};
	useEffect(() => {
		(async () => {
			searchSummoner();
		})();
	}, []);
	return (
		<div className="h-[1819px]">
			<div className="bg-[#1ea1f7] h-[97px]">
				<div className="w-full pt-3 pl-3">
					<img
						src="https://s-lol-web.op.gg/images/icon/opgglogo.svg"
						className="w-20"
					/>
				</div>
				<div className="flex flex-col items-end pr-20">
					<div className="flex items-center justify-end bg-transparent relative pt-3">
						<input
							className="py-1.5 pr-20 pl-2 rounded-md shadow-sm text-sm w-[260px]"
							placeholder="소환사명, 챔피언···"
							id="inputID"
							onChange={(e) => {
								setSummonerName(e.target.value);
							}}
							onKeyPress={keyPress}
						/>
						<img
							src="https://s-lol-web.op.gg/images/icon/icon-gg.svg"
							className="w-6 absolute mr-2 cursor-pointer"
							onClick={searchSummoner}
						/>
					</div>
					<div className="bg-red-500 w-[260px] mt-1 p-2 rounded-sm shadow-sm">
						asdf
					</div>
				</div>
			</div>
			<MidBar summoner={searchData} />
			<div className="mt-8 border-t-2">
				<div className="mx-[200px] flex flex-row items-start justify-center mt-5">
					<LeftBar summoner={searchData} />
					<MainContents />
				</div>
			</div>
		</div>
	);
};

export default Home;
