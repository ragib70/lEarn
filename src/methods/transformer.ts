import { courses } from "../App";

export const transformFuelResponse = (res: any) => {
	if (
		typeof (res?.enrolled_courses_id ? res.enrolled_courses_id[0] : "") ===
		"string"
	) {
		return {
			courses: [],
			progressStatus: {},
		};
	}

	const enrolled_courses_id_int: number[] = (
		res.enrolled_courses_id || []
	).map((e: any) => e.words[0]);
	const cap = enrolled_courses_id_int.findIndex((cid) => cid > 1000);
	const enrolled_courses_id = enrolled_courses_id_int
		.slice(0, cap)
		.map((cid) => cid.toString());
	const progressStatus = enrolled_courses_id.reduce((p: any, c, index) => {
		const sections_completed: number[] =
			((res.sections_completed as any[][]) || [])[index].map(
				(e: any) => e.words[0]
			);
		const cap2 = sections_completed.findIndex((cid) => cid > 1);
		const sections_completed_bool = sections_completed
			.slice(0, cap2)
			.map((flag) => (flag === 1 ? true : false));
		p[c] = sections_completed_bool.reduce((p: any, c2, index) => {
			const lectureStatus = (
				(courses[parseInt(c)] || {}).content || []
			).reduce((p: any, c3: any) => {
				p[c3.id] = {
					status: c2 ? "completed" : "not_yet_started",
				};
				return p;
			}, {});
			p[index] = { completed: c2, ...lectureStatus };
			return p;
		}, {});

		return p;
	}, {});

	return {
		courses: enrolled_courses_id.map((id: string) => parseInt(id)),
		progressStatus,
	};
};

export const transformMetamaskResponse = (res: any) => {
	console.log(res);
	const progressStatus = ((res.enrolledCoursesId as number[]) || []).reduce(
		(p: any, c, index) => {
			p[c] = (
				((res.sectionsCompleted || [])[index] as boolean[]) || []
			).reduce((p: any, c2, index) => {
				const lectureStatus = ((courses[c] || {}).content || []).reduce(
					(p: any, c3: any) => {
						p[c3.id] = {
							status: c2 ? "completed" : "not_yet_started",
						};
						return p;
					},
					{}
				);
				p[index] = { completed: c2, ...lectureStatus };
				return p;
			}, {});

			return p;
		},
		{}
	);

	return {
		courses: (res.enrolledCoursesId || []).map((id: string) =>
			parseInt(id)
		),
		progressStatus,
	};
};
