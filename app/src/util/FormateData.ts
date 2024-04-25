export function FormatDate(dataString: string): string {
    return new Date(dataString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
    });
}
