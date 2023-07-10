export default function FormatMoney(x: number): string {
    return x.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
}