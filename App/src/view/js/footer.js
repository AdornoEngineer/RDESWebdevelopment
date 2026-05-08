const footer = `
<footer class="bg-light text-dark text-left py-4 pb-1 mt-auto shadow-lg">

    <div class="container">

        <div class="row justify-content-around">

            <div class="col-md-3">
                <h5>RDES</h5>

                <p>
                    Robust Data Engineering Solutions focused on scalable data systems.
                </p>
            </div>

            <div class="col-md-auto">

                <h5>Links</h5>

                <ul>
                    <li>
                        <a href="/App/src/view/index.html"
                        class="text-dark text-decoration-none">
                        Home Page
                        </a>
                    </li>

                    <li>
                        <a href="/App/src/view/navbarpages/who_we_are_pages/about_us.html"
                        class="text-dark text-decoration-none">
                        About us
                        </a>
                    </li>

                    <li>
                        <a href="/App/src/view/navbarpages/careers.html"
                        class="text-dark text-decoration-none">
                        Careers
                        </a>
                    </li>

                    <li>
                        <a href="/App/src/view/navbarpages/become_customer.html"
                        class="text-dark text-decoration-none">
                        Become a customer
                        </a>
                    </li>
                </ul>

            </div>

            <div class="col-md-auto">

                <h5>Contact</h5>

                <ul>
                    <li>Email: contact@rdes.com</li>
                    <li>Phone: +55 19 99999-9999</li>
                </ul>

            </div>

        </div>

    </div>

</footer>
`;

document.getElementById("footer").innerHTML = footer;