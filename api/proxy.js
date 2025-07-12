jQuery(document).ready(function ($) {
    $('#sassa-status-form').on('submit', function (e) {
        e.preventDefault();

        const resultElement = $('#sassa-status-result');
        const idNumber = $('#id-number').val().trim();
        const mobileNumber = $('#mobile-number').val().trim();

        if (!idNumber || !mobileNumber) {
            resultElement.html(`<p class="sassa__alert sassa__message--error">Both fields are required.</p>`).show();
            return;
        }

        $('#sassa-loader').show();
        resultElement.hide();

        fetch('https://srd.sassa.gov.za/srdweb/api/web/outcome/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idnumber: idNumber,
                mobile: mobileNumber
            })
        })
        .then(response => response.json())
        .then(data => {
            $('#sassa-loader').hide();
            resultElement.show();

            if (data && data.outcomes && data.outcomes.length > 0) {
                renderResults(data);
            } else if (data.messages && data.messages.length > 0) {
                resultElement.html(`<p class="sassa__alert sassa__message--error">${data.messages[0]}</p>`);
            } else {
                resultElement.html(`
                    <p class="sassa__alert sassa__message--error">
                        Could not find your status. Try again or visit 
                        <a href="https://srd.sassa.gov.za/sc19/status" target="_blank">SASSA Official Site</a>.
                    </p>
                `);
            }
        })
        .catch(err => {
            $('#sassa-loader').hide();
            resultElement.show();
            resultElement.html(`<p class="sassa__alert sassa__message--error">Request failed: ${err.message}</p>`);
        });
    });

    function renderResults(data) {
        let output = `<h3>Your SASSA Application Status</h3>`;
        output += `<div class="application-details-container">`;
        output += `<div style="text-align:center;">
            <button class="sassa__button" onclick="location.reload()">Check Status Again</button>
            <h3 class="sassa__status-info">Application ID: ${data.appId}</h3>
        </div>`;

        data.outcomes.forEach(({ outcome, period, payday, reason }) => {
            if (outcome === 'approved') {
                output += `<div class="application-month-container approved"><p><strong>${period} Approved</strong></p><p>Your payday is <strong>${payday}</strong>.</p></div>`;
            } else if (outcome === 'pending') {
                output += `<div class="application-month-container pending"><p><strong>${period} Pending</strong></p><p>Still pending.</p></div>`;
            } else {
                output += `<div class="application-month-container declined"><p><strong>${period} Declined</strong></p><p>Reason: <strong>${reason}</strong></p></div>`;
            }
        });

        output += `<div style="text-align:center;"><p class="sassa__status-info"><strong>SAPO:</strong> ${data.sapo}</p><p class="sassa__status-info"><strong>SARS:</strong> ${data.sars}</p></div></div>`;
        $('#sassa-status-result').html(output);
    }
});
