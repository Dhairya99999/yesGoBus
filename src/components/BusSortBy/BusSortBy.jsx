import { Button } from "antd";
import { useEffect, useState } from "react";
import { IoArrowUp, IoArrowDown } from "react-icons/io5";
import "./BusSortBy.scss";

const SORT_OPTIONS = [{ label: "Price", sortTerm: "price" }];

export default function BusSortBy({ handleSortByChange, sortBy, setSortBy }) {
	return (
		<div
			className="sortBy-container 
    "
		>
			<div className="sortBy-header">
				<p className="text-xl">Sort By</p>
				{sortBy && (
					<Button
						htmlType="button"
						style={{ marginLeft: "auto" }}
						onClick={() => setSortBy(null)}
					>
						Clear Sort
					</Button>
				)}
			</div>
			<div className="sortBy-options">
				{SORT_OPTIONS.map(({ label, sortTerm }, index) => {
					return (
						<SortToggle
							handleSortByChange={handleSortByChange}
							label={label}
							sortTerm={sortTerm}
							key={label}
							sortBy={sortBy}
						/>
					);
				})}
			</div>
		</div>
	);
}

export function SortToggle({ handleSortByChange, sortTerm, label, sortBy }) {
	const [isAscending, setIsAscending] = useState(true);

	useEffect(() => {
		if (!sortBy) {
			setIsAscending(true);
		}
	}, [sortBy]);

	function handleClick() {
		if (isAscending) {
			handleSortByChange({ ascending: isAscending, sortBy: sortTerm });
		} else {
			handleSortByChange({ ascending: isAscending, sortBy: sortTerm });
		}

		setIsAscending((prev) => !prev);
	}

	return (
		<button className="sort-option-container" onClick={handleClick}>
			<span>{label}</span>

			{isAscending ? <IoArrowUp size={20} /> : <IoArrowDown size={20} />}
		</button>
	);
}
