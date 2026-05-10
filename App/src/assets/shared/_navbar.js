const navbar = `
<nav class="navbar navbar-expand-lg navbar-light bg-light shadow-lg">
    <div class="container-fluid">
        <a class="navbar-brand" href="/App/src/view/index.html">
            <img src="/App/src/view/images/systemweb/Logo.png" width="120">
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">

                <li class="nav-item dropdown me-4">
                    <a class="nav-link dropdown-toggle" href="#" role="button"
                        data-bs-toggle="dropdown">
                        WHO WE ARE
                    </a>

                    <ul class="dropdown-menu">
                        <li>
                            <a class="dropdown-item"
                            href="/App/src/view/navbarpages/who_we_are_pages/about_us.html">
                            ABOUT US
                            </a>
                        </li>

                        <li>
                            <a class="dropdown-item"
                            href="/App/src/view/navbarpages/who_we_are_pages/investors.html">
                            INVESTORS
                            </a>
                        </li>

                        <li>
                            <a class="dropdown-item"
                            href="/App/src/view/navbarpages/who_we_are_pages/media.html">
                            MEDIA
                            </a>
                        </li>

                        <li>
                            <a class="dropdown-item"
                            href="/App/src/view/navbarpages/careers/careers.html">
                            CAREERS
                            </a>
                        </li>

                        <li>
                            <a class="dropdown-item"
                            href="/App/src/view/navbarpages/who_we_are_pages/inclusion.html">
                            INCLUSION
                            </a>
                        </li>
                    </ul>
                </li>

                <li class="nav-item">
                    <a class="nav-link me-4"
                    href="/App/src/view/navbarpages/what_do_we_do/what_do_we_do.html">
                    WHAT DO WE DO
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link me-4"
                    href="/App/src/view/navbarpages/careers/careers.html">
                    CAREERS
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link me-4"
                    href="/App/src/view/navbarpages/become_customer/become_customer.html">
                    BECOME A CUSTOMER
                    </a>
                </li>

            </ul>
        </div>
    </div>
</nav>
`;

document.getElementById("navbar").innerHTML = navbar;
                  