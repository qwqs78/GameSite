namespace BlazorApp1
{
    using System.Threading.Tasks;
    using Microsoft.JSInterop;

    public class TetrisInterop
    {
        private readonly IJSRuntime _jsRuntime;

        public TetrisInterop(IJSRuntime jsRuntime)
        {
            _jsRuntime = jsRuntime;
        }

        public async Task StartTetris(DotNetObjectReference<TetrisInterop> dotNetHelper)
        {
            await _jsRuntime.InvokeVoidAsync("startTetris", dotNetHelper); // tetris.js 함수 호출
        }

        public async Task StopTetris()
        {
            await _jsRuntime.InvokeVoidAsync("stopTetris"); // 게임 중지 함수 (추가 가능)
        }
    }
}
