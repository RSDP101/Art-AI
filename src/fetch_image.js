
async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/sd-dreambooth-library/smiling-friends-cartoon-style",
		{
			headers: {
				Authorization: "Bearer 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",
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.blob();
	return result;
}
query({"inputs": "Astronaut riding a horse"}).then((response) => {
	// Use image
});
