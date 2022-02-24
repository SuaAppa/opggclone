import { NextPage } from "next";
import { useEffect, useState } from "react";
import TeamContents from "./TeamContents";
import axios from "axios";
import { clsMaker } from "../../libs/utils";

interface mainContentsData {
	allGameCnt: number;
	winGameCnt: number;
	loseGameCnt: number;
	winRate: number;
	killRate: string;
	deathRate: string;
	assiRate: string;
	kda: string;
	mostChamp: object;
	position: object;
}

const MainContents: NextPage = (props) => {
	const [matchData, setMatchData] = useState({});
	const [gameType, setGameType] = useState("전체");

	async function getMatchData() {
		const { data } = await axios.get(
			`https://codingtest.op.gg/api/summoner/${props.summoner.name}/matches/`
		);

		if (data) {
			let gameTypeSelector =
				gameType === "전체"
					? data.games
					: data.games.filter((value) => {
							return (value.gameType =
								gameType === "솔랭"
									? "솔랭"
									: gameType === "자랭"
									? "자유 5:5 랭크"
									: "");
					  });
			const setData: object = {
				allGameCnt: data.games ? gameTypeSelector.length : 0,
				winGameCnt: data.games
					? gameTypeSelector.filter((value) => {
							return value.isWin;
					  }).length
					: 0,
				loseGameCnt: data.games
					? gameTypeSelector.filter((value) => {
							return !value.isWin;
					  }).length
					: 0,

				winRate: data.games
					? Math.round(
							(gameTypeSelector.filter((value) => {
								return value.isWin;
							}).length /
								gameTypeSelector.length) *
								100
					  )
					: 0,
				killRate: (
					gameTypeSelector.reduce((prev, curr) => {
						return prev + curr.stats.general.kill;
					}, 0) / gameTypeSelector.length
				).toFixed(1),
				deathRate: (
					gameTypeSelector.reduce((prev, curr) => {
						return prev + curr.stats.general.death;
					}, 0) / gameTypeSelector.length
				).toFixed(1),
				assiRate: (
					gameTypeSelector.reduce((prev, curr) => {
						return prev + curr.stats.general.assist;
					}, 0) / gameTypeSelector.length
				).toFixed(1),
				kda: gameTypeSelector
					.reduce((prev, curr) => {
						return (
							prev +
							Number(
								curr.stats.general.kdaString.replace(":1", "")
							) /
								gameTypeSelector.length
						);
					}, 0)
					.toFixed(2),
				contributionForKillRate: Math.round(
					gameTypeSelector.reduce((prev, curr) => {
						return (
							prev +
							Number(
								curr.stats.general.contributionForKillRate.replace(
									"%",
									""
								)
							)
						);
					}, 0) / gameTypeSelector.length
				),
				mostChamp: data.champions.map((value) => {
					return {
						imgUrl: value.imageUrl,
						name: value.name,
						winRate: Math.round((value.wins / value.games) * 100),
						winCnt: value.wins,
						loseCnt: value.losses,
						kda: (
							(value.kills + value.assists) /
							value.deaths
						).toFixed(2),
					};
				}),
				position: data.positions.map((value) => {
					return {
						name: value.positionName,
						playRate: Math.round((value.games / 20) * 100),
						winRate: Math.round(
							(value.wins / (value.wins + value.losses)) * 100
						),
					};
				}),
				games: data.games,
			};
			setMatchData(setData);
		}
	}

	useEffect(() => {
		getMatchData();
	}, [props.summoner, gameType]);
	return (
		<div className="shadow-sm w-[690px]">
			<div className="flex flex-row items-center justify-start border-[1px] shadow-sm text-[12px] pl-2 space-x-1">
				<span
					className={clsMaker(
						"px-3 py-2  border-blue-600",
						gameType === "전체"
							? "text-blue-600 font-bold border-b-2"
							: "cursor-pointer"
					)}
					onClick={() => {
						setGameType("전체");
					}}
				>
					전체
				</span>
				<span
					className={clsMaker(
						"px-3 py-2  border-blue-600",
						gameType === "솔랭"
							? "text-blue-600 font-bold border-b-2"
							: "cursor-pointer"
					)}
					onClick={() => {
						setGameType("솔랭");
					}}
				>
					솔로랭크
				</span>
				<span
					className={clsMaker(
						"px-3 py-2  border-blue-600",
						gameType === "자랭"
							? "text-blue-600 font-bold border-b-2"
							: "cursor-pointer"
					)}
					onClick={() => {
						setGameType("자랭");
					}}
				>
					자유랭크
				</span>
			</div>
			<div className="divide-x-2 h-[158px] grid grid-cols-3 border-l-[1px] border-r-[1px] border-b-[1px] bg-gray-100">
				<div className="flex flex-col justify-start">
					<span className="text-xs text-gray-500 font-medium p-4">
						{matchData
							? `${matchData.allGameCnt} 전 ${matchData.winGameCnt} 승 ${matchData.loseGameCnt} 패`
							: ""}
					</span>
					<div className="flex flex-row items-center justify-around">
						<div
							className="flex items-center justify-center aspect-square p-4 rounded-full relative w-[90px] bg-blue-500"
							style={{
								background: `conic-gradient(blue ${
									matchData ? matchData.winRate * 3.6 : 0
								}deg,red ${
									matchData ? matchData.winRate * 3.6 : 0
								}deg ${
									matchData
										? 360 - matchData.winRate * 3.6
										: 360
								}deg`,
							}}
						>
							<span className="text-xs font-bold absolute bg-gray-100 rounded-full aspect-square w-[75px] flex items-center justify-center">
								{matchData ? matchData.winRate : null}%
							</span>
						</div>
						<div className="flex flex-col text-sm items-center">
							<div className="text-xs">
								<span>
									{matchData ? matchData.killRate : null}
								</span>{" "}
								/{" "}
								<span>
									{matchData ? matchData.deathRate : null}
								</span>{" "}
								/{" "}
								<span>
									{matchData ? matchData.assiRate : null}
								</span>
							</div>
							<div>
								<span className="text-green-700">
									{matchData ? matchData.kda : null}
								</span>
								:1(
								<span className="text-red-500">
									{matchData.contributionForKillRate}%
								</span>
								)
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col space-y-3 px-3 py-4">
					{matchData.mostChamp
						? matchData.mostChamp.map((value, index) => {
								return (
									<div
										className="flex flex-row text-xs items-start justify-start space-x-3"
										key={index}
									>
										<div>
											<img
												src={value.imgUrl}
												className="w-[34px] aspect-square rounded-full"
											/>
										</div>
										<div className="text-gray-700">
											<div className="text-sm">
												{value.name}
											</div>
											<div className="flex flex-row">
												<span className="text-red-500 mr-1">
													{value.winRate}%
												</span>
												<div className="flex flex-row space-x-2">
													<span>
														({value.winCnt}승{" "}
														{value.loseCnt} 패)
													</span>
													<span className="text-yellow-500 font-bold">
														{value.kda} 평점
													</span>
												</div>
											</div>
										</div>
									</div>
								);
						  })
						: null}
				</div>
				<div className="flex flex-col items-start justify-start px-3 py-4 space-y-3 text-xs text-gray-500">
					<div>
						<span>선호 포지션 (랭크)</span>
					</div>
					{matchData.position
						? matchData.position.map((value, index) => {
								return (
									<div
										className="flex flex-row items-start justify-start space-x-3"
										key={index}
									>
										<div>
											<img
												src={
													value.name === "Top"
														? "https://s-lol-web.op.gg/static/images/site/common/icon-mostposition-top.png"
														: value.name ===
														  "Jungle"
														? "https://s-lol-web.op.gg/static/images/site/common/icon-mostposition-jungle.png"
														: value.name ===
														  "Middle"
														? "https://s-lol-web.op.gg/static/images/site/common/icon-mostposition-mid.png"
														: value.name ===
														  "Bottom"
														? "https://s-lol-web.op.gg/static/images/site/common/icon-mostposition-adc.png"
														: value.name ===
														  "Support"
														? "https://s-lol-web.op.gg/static/images/site/common/icon-mostposition-support.png"
														: ""
												}
												className="aspect-square h-[34px]"
											/>
										</div>
										<div className="flex flex-col items-start">
											<span className="text-sm">
												{value.name}
											</span>
											<div className="flex flex-row space-x-2">
												<span>{value.playRate}%</span>
												<span>
													승률 {value.winRate}%
												</span>
											</div>
										</div>
									</div>
								);
						  })
						: null}
				</div>
			</div>
			{matchData.games
				? matchData.games.map((value, index) => {
						return (
							<div
								className={clsMaker(
									"h-[96px]  border-1px border-[#a1b8cd] mt-3 space-y-[2px] shadow-sm",
									value.needRenew
										? "bg-[#b6b6b6]"
										: value.isWin
										? "bg-[#b0ceea]"
										: "bg-[#d6b5b2]"
								)}
								key={index}
							>
								<div className="text-xs flex flx-row items-center justify-between">
									<div className="flex flex-col items-center space-y-1 text-[#555555] font-[11px] ml-3 w-[70px]">
										<div className="flex flex-col items-center">
											<span className="font-bold">
												{value
													? value.gameType
													: "asdf"}
											</span>
											<span className="tracking-[-0.42px]">
												하루전
											</span>
										</div>
										<div
											className={clsMaker(
												"flex items-center justify-center border-t-[1px] w-[27px]",
												value.needRenew
													? "border-[#94b9d6]"
													: value.isWin
													? "border-[#94b9d6]"
													: "border-[#d0a6a5]"
											)}
										></div>
										<div className="flex flex-col items-center">
											<span
												className={clsMaker(
													"tracking-[-0.42px] font-bold",
													value.needRenew
														? "text-[#000000]"
														: value.isWin
														? "text-[#2c709b]"
														: "text-[#d0021b]"
												)}
											>
												{value.needRenew
													? "다시하기"
													: value.isWin
													? "승리"
													: "패배"}
											</span>
											<span className="tracking-[-0.42px]">
												{Math.floor(
													value.gameLength / 60
												)}
												분
												{value.gameLength % 60 > 0
													? (value.gameLength % 60) +
													  "초"
													: ""}
											</span>
										</div>
									</div>
									<div className="flex flex-col space-y-2 items-center justify-center">
										<div className="flex flex-row space-x-1">
											<div>
												<img
													src={
														value.champion.imageUrl
													}
													className="rounded-full aspect-square h-[46px]"
												/>
											</div>
											<div className="flex flex-col space-y-1">
												{value.spells.map(
													(value, index) => {
														return (
															<img
																src={
																	value.imageUrl
																}
																className="aspect-square h-[22px]"
																key={index}
															/>
														);
													}
												)}
											</div>
											<div className="flex flex-col space-y-1">
												{value.peak.map(
													(value, index) => {
														return (
															<img
																src={value}
																key={index}
																className="aspect-square h-[22px]"
															/>
														);
													}
												)}
											</div>
										</div>
										<div>
											<span className="text-gray-500">
												{value.champion.imageUrl
													.replace(
														"https://opgg-static.akamaized.net/images/lol/champion/",
														""
													)
													.replace(".png", "")}
											</span>
										</div>
									</div>
									<div className="flex flex-col items-center justify-center space-y-1 w-[90px]">
										<div className="flex flex-row space-x-1 text-base text-gray-500 font-bold">
											<span>
												{value.stats.general.kill}
											</span>
											<span>/</span>
											<span className="text-red-700">
												{value.stats.general.death}
											</span>
											<span>/</span>
											<span>
												{value.stats.general.assist}
											</span>
										</div>
										<div className="flex flex-row space-x-1 text-gray-500">
											<span className="font-bold text-gray-700">
												{value.stats.general.kdaString}
											</span>{" "}
											<span>평점</span>
										</div>
										<div className="flex flex-row space-x-1 text-[10px]">
											<div
												className={clsMaker(
													"bg-[#ec4f48] border-[1px] border-[#bf3b36] text-white tracking-[-0.38px] rounded-lg shadow-sm w-[44px] text-center",
													value.stats.general
														.largestMultiKillString ===
														""
														? "hidden"
														: ""
												)}
											>
												{value.stats.general
													.largestMultiKillString ===
												"Double Kill"
													? "더블킬"
													: value.stats.general
															.largestMultiKillString}
											</div>
											<div
												className={clsMaker(
													"bg-[#8c51c5] border-[1px] border-[#7f3590] text-gray-50 rounded-lg shadow-sm w-[31px] text-center",
													value.stats.general
														.opScoreBadge === ""
														? "hidden"
														: ""
												)}
											>
												{
													value.stats.general
														.opScoreBadge
												}
											</div>
										</div>
									</div>
									<div className="flex flex-col items-center space-y-[1px] text-gray-500">
										<span>레벨 {value.champion.level}</span>
										<span>
											{value.stats.general.cs} (
											{value.stats.general.csPerMin}) CS
										</span>
										<span className="text-red-500">
											킬관여{" "}
											{
												value.stats.general
													.contributionForKillRate
											}
										</span>
										<span>매치 평균</span>
										<span className="font-bold text-gray-700">
											{value.tierRankShort}
										</span>
									</div>

									<div>
										<div className="flex items-center justify-center">
											<div className="grid grid-cols-3 gap-[2px]">
												{value.items.map(
													(value2, index) => {
														return value.items
															.length -
															1 !==
															index ? (
															<div
																className="bg-slate-400 rounded-md"
																key={index}
															>
																<img
																	src={
																		value2.imageUrl
																	}
																	className="aspect-square h-[22px] rounded-md"
																	id={value2.imageUrl
																		.replace(
																			"https://opgg-static.akamaized.net/images/lol/item/",
																			""
																		)
																		.replace(
																			".png",
																			""
																		)}
																/>
															</div>
														) : (
															new Array(6 - index)
																.fill(0)
																.map(
																	(
																		value,
																		index
																	) => {
																		return (
																			<div
																				className="bg-slate-400 rounded-md aspect-square h-[22px]"
																				key={
																					index
																				}
																			></div>
																		);
																	}
																)
														);
													}
												)}
											</div>
											<div className="ml-[2px] flex flex-col space-y-[2px]">
												<div className="bg-slate-400 rounded-md">
													<img
														src={
															value.items[
																value.items
																	.length - 1
															].imageUrl
														}
														className="aspect-square h-[22px] rounded-md"
													/>
												</div>
												<div className="bg-slate-400 rounded-full">
													<img
														src="https://s-lol-web.op.gg/static/images/icon/common/icon-buildblue-p.png?v=1645189214748"
														className="aspect-square h-[22px] rounded-full"
													/>
												</div>
											</div>
										</div>
										<div className="flex items-center justify-center space-x-1 text-gray-700">
											<img
												src={
													value.isWin
														? "https://s-lol-web.op.gg/static/images/icon/common/icon-ward-blue.png?v=1645189214748"
														: "https://s-lol-web.op.gg/static/images/icon/common/icon-ward-red.png?v=1645189214748"
												}
												className="aspect-square rounded-full h-[16px]"
											/>
											<span>제어 와드</span>
											<span>
												{
													value.stats.ward
														.visionWardsBought
												}
											</span>
										</div>
									</div>
									<TeamContents
										summoner={value.summonerName}
										gameId={value.gameId}
									/>
									<div
										className={clsMaker(
											"h-[96px] w-[30px] flex items-end justify-center border-[1px] ",
											value.needRenew
												? "bg-[#a7a7a7] border-[#999999]"
												: value.isWin
												? "bg-[#7fb0e1] border-[#549dc7]"
												: "bg-[#e89c95] border-[#c8817c]"
										)}
									>
										<img
											src={
												value.needRenew
													? "https://s-lol-web.op.gg/static/images/icon/common/icon-viewdetail-grey.png?v=1645189214748"
													: value.isWin
													? "https://s-lol-web.op.gg/static/images/icon/common/icon-viewdetail-blue.png?v=1645189214748"
													: "https://s-lol-web.op.gg/static/images/icon/common/icon-viewdetail-red.png?v=1645189214748"
											}
											className="p-2"
										/>
									</div>
								</div>
							</div>
						);
				  })
				: ""}
		</div>
	);
};
export default MainContents;
