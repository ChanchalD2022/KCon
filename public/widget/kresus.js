const baseURL = `https://kresus.99starzplayers.com/v1`;
let token = "";

document.addEventListener("DOMContentLoaded", function (e) {
  let button = document.getElementById("kresus");

  var head = document.getElementsByTagName("HEAD")[0];
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "https://kresus-widget.vercel.app/widget/kresus.css ";
  head.appendChild(link);

  if (button) {
    button.addEventListener("click", function (e) {
      const appContainer = document.getElementsByTagName("body");
      const tempContainer = document.createElement("div");
      tempContainer.innerHTML = mainForm();
      tempContainer.id = "kresus_temp_container";
      appContainer[0].appendChild(tempContainer);

      const modal_kresus_inner = document.getElementById("modal_kresus_inner");
      if (modal_kresus_inner) {
        modal_kresus_inner.innerHTML = Modal();
      }
    });
  }
});

function handleClick(step) {
  const overlyContainer = document.getElementById("modal_kresus_inner");
  if (overlyContainer) {
    overlyContainer.innerHTML = GetMyFreeWallet();

    const kresus_elements = document.getElementById("kresus_elements");
    if (kresus_elements) {
      let element, stepper;
      if (parseInt(step) === 0) {
        element = EmailInput();
        stepper = Stepper_25();
      } else if (parseInt(step) === 1) {
        element = EmailVerification();
        stepper = stepper_52();
      } else {
        element = Success();
        stepper = "";
      }
      kresus_elements.innerHTML = element;

      const kresus_stepper = document.getElementById("kresus_stepper");
      if (kresus_stepper) {
        if (stepper) kresus_stepper.innerHTML = stepper;
        else kresus_stepper.remove();
      }
    }
  }
}

function validateEmail(email) {
  // Regular expression to validate the email format
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  return emailRegex.test(email);
}

function handleChange() {
  const emailInput = document.getElementById("email_Input");
  const submitButton = document.getElementById("Get_my_verification_code");

  if (validateEmail(emailInput.value.trim())) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}
const handleSubmit = async (e) => {
  e.preventDefault();
  let check = true;
  const submitButton = document.getElementById("Get_my_verification_code");
  const emailInput = document.getElementById("email_Input");
  const error_message_email_Input = document.getElementById(
    "error_message_email_Input"
  );

  if (error_message_email_Input) {
    error_message_email_Input.innerHTML = "";
  }
  try {
    if (submitButton) {
      submitButton.disabled = true;
    }

    let button = document.getElementById("kresus");
    const data_aid = button.getAttribute("data-aid"); //this.getAttribute("data-aid");

    const body = JSON.stringify({
      dapp_id: data_aid, //"mbqi9U",
      email: emailInput.value.trim(),
    });

    let response = await fetch(`${baseURL}/auth/signup`, {
      method: "POST",
      body: body,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    response = await response.json();
    token = response.token;

    if (response.token) {
      await handleClick(1);
      OPTHandle();
    } else {
      if (error_message_email_Input) {
        error_message_email_Input.innerHTML = response.message;
      }

      if (submitButton) {
        submitButton.disabled = false;
        check = false;
      }
    }
  } catch (err) {
    console.log(err);
    if (error_message_email_Input) {
      error_message_email_Input.innerHTML = err.response.data.message;
    }
  } finally {
    if (submitButton && check) {
      submitButton.disabled = true;
    }
  }
};

const handleClose = () => {
  const kresus_temp_container = document.getElementById(
    "kresus_temp_container"
  );
  if (kresus_temp_container) {
    kresus_temp_container.remove();
  }
};

// For OPT start

function OPTHandle() {
  const inputs = document.querySelectorAll(".otp-field-js input");

  inputs.forEach((input, index) => {
    input.dataset.index = index;
    input.addEventListener("keyup", handleOtp);
    input.addEventListener("paste", handleOnPasteOtp);
  });
}

function handleOtp(e) {
  const inputs = document.querySelectorAll(".otp-field-js input");
  const input = e.target;
  let value = input.value;
  let isValidInput = value.match(/[0-9a-z]/gi);
  input.value = "";
  input.value = isValidInput ? value[0] : "";

  let fieldIndex = input.dataset.index;
  if (fieldIndex < inputs.length - 1 && isValidInput) {
    input.nextElementSibling.focus();
  }

  if (e.key === "Backspace" && fieldIndex > 0) {
    input.previousElementSibling.focus();
  }

  if (fieldIndex == inputs.length - 1 && isValidInput) {
    submit();
  }
}

function handleOnPasteOtp(e) {
  const inputs = document.querySelectorAll(".otp-field-js input");
  const data = e.clipboardData.getData("text");
  const value = data.split("");
  if (value.length === inputs.length) {
    inputs.forEach((input, index) => (input.value = value[index]));
    submit();
  }
}

function submit() {
  console.log("Submitting...");
  const inputs = document.querySelectorAll(".otp-field-js input");
  // 👇 Entered OTP
  let otp = "";
  inputs.forEach((input) => {
    otp += input.value;
    input.disabled = true;
    input.classList.add("disabled");
  });
  handleVerify(otp);
}

const handleVerify = async (otp) => {
  const kresusOptError = document.getElementById("kresus-opt-error");
  try {
    if (kresusOptError) {
      kresusOptError.innerHTML = "";
    }
    const apiData = JSON.stringify({ code: otp });
    let response = await fetch(`${baseURL}/auth/email-verification/${token}`, {
      method: "POST",
      body: apiData,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    response = await response.json();
    if (response.message !== "Email Verified Successfully") {
      if (kresusOptError) {
        kresusOptError.innerHTML = response.message;
      }
    } else {
      await handleClick(2);
    }
  } catch (err) {
    if (kresusOptError) {
      kresusOptError.innerHTML = err.response.data.message;
    }
  }
};

// For OPT End

function Modal() {
  return `
  <div class="main-screen">
  <div class="close-icon-container">
    <div class="close-icon">
      <img src="https://kresus-widget.vercel.app/widget/assets/icon/close.svg" onclick={handleClose()} width="20" height="20" alt="" />
    </div>
  </div>
  <div class="content">
    <div class="logo">
      <img src="https://kresus-widget.vercel.app/widget/assets/icon/logo.webp" alt="" />
    </div>
    <div class="title">
      <h1>
        Scan with your kresus wallet
        <br /> to connect
      </h1>
    </div>
    <div class="qr-code">
      <img src="https://kresus-widget.vercel.app/widget/assets/icon/qrCode.png" style="border-radius: 20px;" height="200" alt="" />
    </div>
  </div>
  <div class="footer">
    <div>
      <button class="apple-store-button">
        <img src="https://kresus-widget.vercel.app/widget/assets/icon/appleLogo.svg" alt="" />
      </button>
    </div>
    <div class="description">
      <p>
        <b>Don't have Kresus?</b> Get the best-in-class wallet to
        <br /> hold all of your digital collectibles
      </p>
    </div>
    <div>
      <button class="get-wallet-btn" onclick="handleClick(0)">
        Get my free wallet
      </button>
    </div>
  </div>
</div>
  `;
}
function mainForm() {
  return `
  <div class="overly-container" id="kresus_overly_container">
  <div class="modal">
    <div class="modal-inner" id="modal_kresus_inner"></div>
  </div>
</div>
  `;
}

function GetMyFreeWallet() {
  return `
  <div class="form-container">
  <div class="header">
    <div class="icon-container">
      <img
        src="https://kresus-widget.vercel.app/widget/assets/icon/close.svg"
        alt=""
        onclick={handleClose()}
      />
    </div>
    <div class="logo">
      <img
        src="https://kresus-widget.vercel.app/widget/assets/icon/logo.webp"
        alt=""
      />
    </div>
  </div>

  <div class="stepper" id="kresus_stepper"></div>
  <div class="elements" id="kresus_elements"></div>
</div>;
    `;
}

function Stepper_25() {
  return `
  <div
  class='indicator'
  style="width:25%;"
  ></div>
  <div class='tags'>
  <div>
    <img src='' alt='' />
    <p class="label active">
      Email
    </p>
  </div>
  <div>
    <img src='' alt='' />
    <p class="label">Verify</p>
  </div>
  <div>
    <img src='' alt='' />
    <p class='label'>Download</p>
  </div>
  </div>
  `;
}

function stepper_52() {
  return `
  <div
    class='indicator'
    style="width:52%;"
    ></div>
    <div class='tags'>
    <div>
      <img src='' alt='' />
      <p class="label active">
        Email
      </p>
    </div>
    <div>
      <img src='' alt='' />
      <p class="label active">Verify</p>
    </div>
    <div>
      <img src='' alt='' />
      <p class='label'>Download</p>
    </div>
    </div>
  `;
}

function EmailInput() {
  return `
  <div class="email-input">
  <h1 class="title">What's your email address?</h1>
  <p class="description">
    We'll send you a verification code to confirm your identity and set up your
    new Kresus Wallet.
  </p>
  <form onsubmit="handleSubmit(event)">
    <div class="input-container">
      <input type="text" value="" id="email_Input" oninput="handleChange()" placeholder="Please enter email" />
      <p class="error" id="error_message_email_Input"></p>
    </div>
    <button
      class="submit-button"
      id="Get_my_verification_code"
      disabled="true"
      type="submit"
    >
      Get my verification code
    </button>
  </form>
</div>
  `;
}

function EmailVerification() {
  return `
  <div class="verify-email">
  <h1 class="title">
    Enter the 6-digit one-time <br />
    verification code below.
  </h1>
  <p class="description">Verification code sent to example@gmail.com</p>
  <div class="otp-input">
    <div class="otp-field-js">
      <input type="text" maxlength="1" />
      <input type="text" maxlength="1" />
      <input class="space" type="text" maxlength="1" />
      <input type="text" maxlength="1" />
      <input type="text" maxlength="1" />
      <input type="text" maxlength="1" />
    </div>
    <p class="error" id="kresus-opt-error" ></p>
  </div>
  <p class="description">
    A verification code has been sent to your phone. If didn't receive it,
    please wait 30 seconds and request a new one.
  </p>

  <p class="description">
    <b>Didn't get a verification code?</b>
    <span onclick="handleClick(0)">Send Again</span> | 
    <span onclick="handleClick(0)">Edit Email</span>
  </p>
</div>;
  `;
}

function Success() {
  return `
  <div class="success">
  <h1 class="title">Your Kresusu wallet is ready!</h1>
  <p class="description">
    Access it now by downloading Kresus from the
    <br /> App Store or scanning the QR code below.
  </p>
  <p class="small-text">
    Log in using your email address:
    <br />
    <b>example@gmail.com</b>
  </p>
  <div class="qr-image">
    <img
      src="https://kresus-widget.vercel.app/widget/assets/icon/qrCode.png"
      alt=""
    />
  </div>
</div>
  `;
}