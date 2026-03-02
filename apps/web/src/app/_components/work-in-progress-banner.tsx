export const WorkInProgressBanner = () => {
	return (
		<div className="w-full bg-amber-500/10 border-b border-amber-500/20">
			<div className="mx-auto flex max-w-2xl items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-amber-600">
				<span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
				Feather is still in active development — expect bugs & changes
			</div>
		</div>
	);
};
