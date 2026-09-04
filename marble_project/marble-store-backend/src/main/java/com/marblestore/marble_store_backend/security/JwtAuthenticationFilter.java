package com.marblestore.marble_store_backend.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.marblestore.marble_store_backend.Services.CustomUserDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            CustomUserDetailsService userDetailsService) {

        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain)
        throws ServletException, IOException {

    System.out.println(
            "========== JWT FILTER =========="
    );

    System.out.println(
            "REQUEST: "
                    + request.getMethod()
                    + " "
                    + request.getRequestURI()
    );

    final String authHeader =
            request.getHeader("Authorization");

    System.out.println(
            "AUTH HEADER: "
                    + authHeader
    );

    if (authHeader == null ||
            !authHeader.startsWith("Bearer ")) {

        System.out.println(
                "NO JWT FOUND"
        );

        filterChain.doFilter(
                request,
                response
        );

        return;
    }

    try {

        final String jwt =
                authHeader.substring(7);

        final String email =
                jwtService.extractUsername(jwt);

        System.out.println(
                "JWT EMAIL: "
                        + email
        );

        if (email != null &&
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        == null) {

            UserDetails userDetails =
                    userDetailsService
                            .loadUserByUsername(email);

            System.out.println(
                    "USER LOADED: "
                            + userDetails.getUsername()
            );

            if (jwtService.isTokenValid(
                    jwt,
                    userDetails)) {

                System.out.println(
                        "JWT VALID"
                );

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);

                System.out.println(
                        "AUTHENTICATED: "
                                + SecurityContextHolder
                                    .getContext()
                                    .getAuthentication()
                                    .isAuthenticated()
                );

                System.out.println(
                        "AUTHORITIES: "
                                + userDetails.getAuthorities()
                );
            }
        }

    } catch (Exception exception) {

        System.out.println(
                "JWT AUTHENTICATION ERROR: "
                        + exception.getMessage()
        );

        exception.printStackTrace();
    }

    filterChain.doFilter(
            request,
            response
    );
}
}