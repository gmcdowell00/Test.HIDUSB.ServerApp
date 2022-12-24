using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Test.HIDUSB.ServerApp.Pages
{
    // Input Enum
    // Represnet foot pedal input and input combinations
    // 6 permutations and 1 combinations 
    enum FootPedal { KEYUP, REW, PLAY, REWPLAY, FWD, REWFWD, FWDPLAY }

    public class TestHIDComponent : ComponentBase
    {
        /// <summary>
        /// Invokable JavaScript Method
        /// Prints foot pedal input
        /// </summary>
        /// <param name="i"></param>
        [JSInvokable]
        public static void ReceivedInput(int i)
        {
            // Print input
            System.Diagnostics.Debug.Print($" Foot Pedal Input: {(FootPedal)i}");

        }
    }
}
